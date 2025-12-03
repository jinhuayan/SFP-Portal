import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import Animal from "../models/Animal.js";

// Environment / configuration
const DO_SPACES_KEY = process.env.DO_SPACES_KEY;
const DO_SPACES_SECRET = process.env.DO_SPACES_SECRET;
const SPACES_ENDPOINT =
  process.env.DO_SPACES_ENDPOINT || "nyc3.digitaloceanspaces.com";
const BUCKET_NAME = process.env.DO_SPACES_BUCKET || "sfp-portal-photos";

// Configure AWS SDK (v2) for DigitalOcean Spaces (S3-compatible)
const s3 = new AWS.S3({
  endpoint: `https://${SPACES_ENDPOINT}`,
  region: "us-east-1", // Per DO docs; actual DC derived from endpoint
  accessKeyId: DO_SPACES_KEY,
  secretAccessKey: DO_SPACES_SECRET,
  signatureVersion: "v4",
  s3ForcePathStyle: false, // Use virtual-hosted style (bucket in subdomain)
});

console.log("[Spaces Config]", {
  hasKey: !!DO_SPACES_KEY,
  hasSecret: !!DO_SPACES_SECRET,
  endpoint: SPACES_ENDPOINT,
  bucket: BUCKET_NAME,
});

function buildPublicUrl(key) {
  return `https://${BUCKET_NAME}.${SPACES_ENDPOINT}/${key}`;
}

// Upload a new photo for an animal
export const uploadAnimalPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const { animalId } = req.params;

    const animal = await Animal.findOne({ where: { unique_id: animalId } });
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub;
    if (
      userRole === "foster" &&
      Number(animal.volunteer_id) !== Number(userId)
    ) {
      return res
        .status(403)
        .json({ message: "You can only upload photos for your own animals" });
    }
    if (!(userRole === "admin" || userRole === "foster")) {
      return res
        .status(403)
        .json({ message: "Only admin and foster can upload photos" });
    }

    const ext = (req.file.originalname.split(".").pop() || "jpg").toLowerCase();
    const key = `animals/${animalId}/${uuidv4()}.${ext}`;

    const putParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read", // Make directly accessible
    };

    console.log("[Spaces Upload] Attempting PutObject", {
      bucket: BUCKET_NAME,
      key,
      size: req.file.buffer.length,
      contentType: req.file.mimetype,
    });

    try {
      const result = await s3.putObject(putParams).promise();
      console.log("[Spaces Upload] Success", { eTag: result.ETag });
    } catch (err) {
      console.error("[Spaces Upload] Failed", {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        region: "us-east-1",
        endpoint: SPACES_ENDPOINT,
        bucket: BUCKET_NAME,
        key,
        originalError: err.originalError?.message,
      });
      // Attempt to capture raw body if available
      if (err?.response && err.response.data) {
        console.error(
          "[Spaces Upload] Raw response data",
          err.response.data.toString().slice(0, 500)
        );
      }
      return res.status(500).json({ message: "Upload failed", code: err.code });
    }

    const url = buildPublicUrl(key);
    const updated = [...(animal.image_urls || []), url];
    await animal.update({ image_urls: updated });

    return res.status(201).json({ message: "Photo uploaded", url });
  } catch (e) {
    console.error("[Spaces Upload] Unexpected error", e);
    next(e);
  }
};

// Get photos for an animal
export const getAnimalPhotos = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const animal = await Animal.findOne({ where: { unique_id: animalId } });
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    return res.json({ photos: animal.image_urls || [] });
  } catch (e) {
    next(e);
  }
};

// Delete a photo (by index)
export const deleteAnimalPhoto = async (req, res, next) => {
  try {
    const { animalId, photoIndex } = req.params;
    const index = Number(photoIndex);
    const animal = await Animal.findOne({ where: { unique_id: animalId } });
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub;
    if (
      userRole === "foster" &&
      Number(animal.volunteer_id) !== Number(userId)
    ) {
      return res
        .status(403)
        .json({ message: "You can only modify photos for your own animals" });
    }
    if (!(userRole === "admin" || userRole === "foster")) {
      return res
        .status(403)
        .json({ message: "Only admin and foster can delete photos" });
    }

    const photos = animal.image_urls || [];
    if (index < 0 || index >= photos.length) {
      return res.status(400).json({ message: "Invalid photo index" });
    }

    const url = photos[index];
    // Extract key from URL (after bucket endpoint)
    let key;
    try {
      const u = new URL(url);
      key = u.pathname.slice(1); // remove leading '/'
    } catch {
      key = null;
    }

    photos.splice(index, 1);
    await animal.update({ image_urls: photos });

    if (key) {
      s3.deleteObject({ Bucket: BUCKET_NAME, Key: key })
        .promise()
        .then(() => {
          console.log("[Spaces Delete] Deleted key", key);
        })
        .catch((err) => {
          console.error("[Spaces Delete] Failed", {
            key,
            code: err.code,
            message: err.message,
          });
        });
    }

    return res.json({ message: "Photo deleted" });
  } catch (e) {
    next(e);
  }
};

// Set primary photo (by index)
export const setPrimaryPhoto = async (req, res, next) => {
  try {
    const { animalId, photoIndex } = req.params;
    const index = Number(photoIndex);
    const animal = await Animal.findOne({ where: { unique_id: animalId } });
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub;
    if (
      userRole === "foster" &&
      Number(animal.volunteer_id) !== Number(userId)
    ) {
      return res
        .status(403)
        .json({ message: "You can only modify photos for your own animals" });
    }
    if (!(userRole === "admin" || userRole === "foster")) {
      return res
        .status(403)
        .json({ message: "Only admin and foster can set primary photo" });
    }

    const photos = animal.image_urls || [];
    if (index < 0 || index >= photos.length) {
      return res.status(400).json({ message: "Invalid photo index" });
    }

    // Move selected photo to front
    const [selected] = photos.splice(index, 1);
    const reordered = [selected, ...photos];
    await animal.update({ image_urls: reordered });

    return res.json({ message: "Primary photo set", photos: reordered });
  } catch (e) {
    next(e);
  }
};

// Diagnostics: list buckets & attempt simple put to test connectivity (admin only via route protection)
export const listSpacesBuckets = async (req, res, next) => {
  try {
    const diag = {};
    try {
      const { Buckets } = await s3.listBuckets().promise();
      diag.buckets = Buckets?.map((b) => b.Name);
    } catch (e) {
      diag.listBucketsError = { code: e.code, message: e.message };
    }
    try {
      const testKey = `diagnostics/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.txt`;
      await s3
        .putObject({
          Bucket: BUCKET_NAME,
          Key: testKey,
          Body: "diagnostic",
          ACL: "private",
        })
        .promise();
      diag.putObject = { success: true, key: testKey };
    } catch (e) {
      diag.putObjectError = {
        code: e.code,
        message: e.message,
        statusCode: e.statusCode,
      };
    }
    return res.json({
      config: {
        bucket: BUCKET_NAME,
        endpoint: SPACES_ENDPOINT,
        hasKey: !!DO_SPACES_KEY,
        hasSecret: !!DO_SPACES_SECRET,
      },
      diag,
    });
  } catch (e) {
    next(e);
  }
};
