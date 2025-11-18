import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Animal from "../models/Animal.js";
import Volunteer from "../models/Volunteer.js";

// Helper to format volunteer with full_name
const formatVolunteer = (vol) => {
  if (!vol) return null;
  const data = vol.toJSON();
  return {
    ...data,
    full_name: `${data.first_name} ${data.last_name}`,
  };
};

export const getAllAnimals = async (req, res, next) => {
  try {
    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub;

    let whereClause = {};

    // Foster can only see animals they created
    if (userRole === "foster") {
      whereClause.volunteer_id = Number(userId);
    }
    // Admin sees all animals

    const animals = await Animal.findAll({
      where: whereClause,
    });

    // Attach creator volunteer and interviewer details
    const enriched = await Promise.all(
      animals.map(async (animal) => {
        const plain = animal.toJSON();
        let volunteer = null;
        let interviewer = null;
        try {
          if (plain.volunteer_id) {
            volunteer = await Volunteer.findByPk(plain.volunteer_id, {
              attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "role",
                "status",
              ],
            });
          }
        } catch (e) {
          console.error("Error fetching volunteer:", e.message);
        }
        try {
          if (plain.interviewer_id) {
            interviewer = await Volunteer.findByPk(plain.interviewer_id, {
              attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "role",
                "status",
              ],
            });
          }
        } catch (e) {
          console.error("Error fetching interviewer:", e.message);
        }
        return {
          ...plain,
          volunteer: formatVolunteer(volunteer),
          interviewer: formatVolunteer(interviewer),
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    next(error);
  }
};

export const getAnimalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lookup by unique_id (string like "SFP-002"), not by numeric PK
    const animal = await Animal.findOne({
      where: { unique_id: id },
    });

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    // Foster can only view animals they created
    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub;

    if (
      userRole === "foster" &&
      Number(animal.volunteer_id) !== Number(userId)
    ) {
      return res
        .status(403)
        .json({ message: "You can only view animals you created" });
    }

    const plain = animal.toJSON();
    let volunteer = null;
    let interviewer = null;
    try {
      if (plain.volunteer_id) {
        volunteer = await Volunteer.findByPk(plain.volunteer_id, {
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
          ],
        });
      }
    } catch (e) {
      console.error("Error fetching volunteer:", e.message);
    }
    try {
      if (plain.interviewer_id) {
        interviewer = await Volunteer.findByPk(plain.interviewer_id, {
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
          ],
        });
      }
    } catch (e) {
      console.error("Error fetching interviewer:", e.message);
    }
    res.status(200).json({
      ...plain,
      volunteer: formatVolunteer(volunteer),
      interviewer: formatVolunteer(interviewer),
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableAnimals = async (req, res, next) => {
  try {
    const availableAnimals = await Animal.findAll({
      where: { 
        status: {
          [Op.in]: ["published", "interviewing"]
        }
      },
    });
    const enriched = await Promise.all(
      availableAnimals.map(async (animal) => {
        const plain = animal.toJSON();
        let volunteer = null;
        try {
          if (plain.volunteer_id) {
            volunteer = await Volunteer.findByPk(plain.volunteer_id, {
              attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "role",
                "status",
              ],
            });
          }
        } catch (e) {
          console.error("Error fetching volunteer:", e.message);
        }
        return { ...plain, volunteer: formatVolunteer(volunteer) };
      })
    );
    res.status(200).json(enriched);
  } catch (error) {
    next(error);
  }
};

export const getAdoptedAnimals = async (req, res, next) => {
  try {
    const adoptedAnimals = await Animal.findAll({
      where: { status: "adopted" },
    });
    const enriched = await Promise.all(
      adoptedAnimals.map(async (animal) => {
        const plain = animal.toJSON();
        let volunteer = null;
        try {
          if (plain.volunteer_id) {
            volunteer = await Volunteer.findByPk(plain.volunteer_id, {
              attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "role",
                "status",
              ],
            });
          }
        } catch (e) {
          console.error("Error fetching volunteer:", e.message);
        }
        return { ...plain, volunteer: formatVolunteer(volunteer) };
      })
    );
    res.status(200).json(enriched);
  } catch (error) {
    next(error);
  }
};

// Get total count of all animals (public)
export const getTotalAnimalsCount = async (req, res, next) => {
  try {
    const count = await Animal.count();
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

export const createAnimal = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { volunteer_id, ...animalData } = req.body;

    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub;

    let creatorVolunteerId = volunteer_id;

    if (userRole === "foster") {
      // Foster always creates animals for themselves
      creatorVolunteerId = Number(userId);
    } else if (userRole === "admin") {
      // Admin can specify volunteer_id or default to themselves
      creatorVolunteerId = volunteer_id || Number(userId);
    } else {
      // Only admin and foster can create animals
      return res
        .status(403)
        .json({ message: "Only admin and foster can create animals" });
    }

    // Check if volunteer exists
    const volunteer = await Volunteer.findByPk(creatorVolunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Generate unique_id
    const lastAnimal = await Animal.findOne({
      order: [["created_at", "DESC"]],
    });

    let nextNumber = 1;
    if (lastAnimal) {
      const lastId = lastAnimal.unique_id;
      const match = lastId.match(/^SFP-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const uniqueId = `SFP-${String(nextNumber).padStart(3, "0")}`;

    // Create new animal in database
    const newAnimal = await Animal.create({
      ...animalData,
      unique_id: uniqueId,
      volunteer_id: volunteer.id,
    });

    // Include volunteer data in response
    const animalWithVolunteer = await Animal.findByPk(newAnimal.id);
    const plain = animalWithVolunteer.toJSON();
    const volunteerInfo = await Volunteer.findByPk(plain.volunteer_id, {
      attributes: ["id", "first_name", "last_name", "role", "status"],
    });
    res.status(201).json({
      ...plain,
      volunteer: formatVolunteer(volunteerInfo),
      interviewer: null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { volunteer_id, ...updateData } = req.body;

    // Find animal in database
    const animal = await Animal.findByPk(id);

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    // Only admin can update animals
    const userRole = String(req.user?.role || "").toLowerCase();

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can update animals" });
    }

    // Update volunteer if provided
    if (volunteer_id) {
      const volunteer = await Volunteer.findByPk(volunteer_id);

      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }

      updateData.volunteer_id = volunteer.id;
    }

    // Update animal in database
    await animal.update(updateData);

    // Include volunteer data in response
    const updatedAnimal = await Animal.findByPk(id);
    const plain = updatedAnimal.toJSON();
    const volunteerInfo = plain.volunteer_id
      ? await Volunteer.findByPk(plain.volunteer_id, {
          attributes: ["id", "first_name", "last_name", "role", "status"],
        })
      : null;
    const interviewerInfo = plain.interviewer_id
      ? await Volunteer.findByPk(plain.interviewer_id, {
          attributes: ["id", "first_name", "last_name", "role", "status"],
        })
      : null;
    res.status(200).json({
      ...plain,
      volunteer: formatVolunteer(volunteerInfo),
      interviewer: formatVolunteer(interviewerInfo),
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnimalState = async (req, res, next) => {
  try {
    const { id } = req.params; // This is unique_id like "SFP-002"
    const { status } = req.body;

    // Find animal by unique_id, not by integer id
    const animal = await Animal.findOne({
      where: { unique_id: id },
    });

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    // Check user role
    const userRole = String(req.user?.role || "").toLowerCase();

    // Valid animal statuses: draft, fostering, ready, published, interviewing, reserved, adopted, archived
    const validAnimalStatuses = [
      "draft",
      "fostering",
      "ready",
      "published",
      "interviewing",
      "reserved",
      "adopted",
      "archived",
    ];

    // Validate the status is valid
    if (!validAnimalStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validAnimalStatuses.join(
          ", "
        )}`,
      });
    }

    // Role-based permission enforcement
    if (userRole === "interviewer") {
      // Interviewers can only set status to "interviewing"
      if (status !== "interviewing") {
        return res.status(403).json({
          message: "Interviewers can only set status to 'interviewing'",
        });
      }
    } else if (userRole === "admin") {
      // Admins can set any status
    } else {
      // All other roles are denied
      return res.status(403).json({
        message: "Only admin and interviewer can update animal status",
      });
    }

    // Update status in database
    await animal.update({ status });

    // Include volunteer data in response
    const updatedAnimal = await Animal.findOne({
      where: { unique_id: id },
    });
    const plain = updatedAnimal.toJSON();
    const volunteerInfo = plain.volunteer_id
      ? await Volunteer.findByPk(plain.volunteer_id, {
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
          ],
        })
      : null;
    const interviewerInfo = plain.interviewer_id
      ? await Volunteer.findByPk(plain.interviewer_id, {
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
          ],
        })
      : null;
    res.status(200).json({
      ...plain,
      volunteer: formatVolunteer(volunteerInfo),
      interviewer: formatVolunteer(interviewerInfo),
    });
  } catch (error) {
    console.error("Error in updateAnimalState:", error.message || error);
    next(error);
  }
};

export const deleteAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find animal in database
    const animal = await Animal.findByPk(id);

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    // Only admin can delete animals
    const userRole = String(req.user?.role || "").toLowerCase();

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can delete animals" });
    }

    // Delete from database
    await animal.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Assign or update interviewer for an animal (admin only)
export const assignAnimalInterviewer = async (req, res, next) => {
  try {
    const { id } = req.params; // animal primary key (numeric)
    const { interviewer_id } = req.body;

    if (!interviewer_id) {
      return res.status(400).json({ message: "interviewer_id is required" });
    }

    const animal = await Animal.findByPk(id);
    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    const userRole = String(req.user?.role || "").toLowerCase();
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can assign an interviewer" });
    }

    const interviewer = await Volunteer.findByPk(interviewer_id);
    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }
    if (String(interviewer.role).toLowerCase() !== "interviewer") {
      return res
        .status(400)
        .json({ message: "Selected volunteer is not an interviewer" });
    }

    await animal.update({ interviewer_id: interviewer.id });

    const plain = animal.toJSON();
    const volunteerInfo = plain.volunteer_id
      ? await Volunteer.findByPk(plain.volunteer_id, {
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
          ],
        })
      : null;
    const interviewerInfo = await Volunteer.findByPk(interviewer.id, {
      attributes: ["id", "first_name", "last_name", "email", "role", "status"],
    });

    res.status(200).json({
      ...plain,
      volunteer: formatVolunteer(volunteerInfo),
      interviewer: formatVolunteer(interviewerInfo),
    });
  } catch (error) {
    next(error);
  }
};
