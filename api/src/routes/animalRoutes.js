import express from "express";
import {
  getAllAnimals,
  getAnimalById,
  getAvailableAnimals,
  getAdoptedAnimals,
  getTotalAnimalsCount,
  createAnimal,
  updateAnimal,
  updateAnimalState,
  deleteAnimal,
  assignAnimalInterviewer,
} from "../controller/animalController.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import { body } from "express-validator";

const router = express.Router();

// Public routes (must come before :id pattern)
router.get("/available", getAvailableAnimals);
router.get("/adopted", getAdoptedAnimals);
router.get("/stats/total", getTotalAnimalsCount);
router.get("/:id", getAnimalById);

// Protected routes - must come AFTER public routes
router.get("/", authMiddleware, getAllAnimals);

// Protected routes (requires authentication)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "foster"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("species").notEmpty().withMessage("Species is required"),
    body("breed").notEmpty().withMessage("Breed is required"),
    body("age").notEmpty().withMessage("Age is required"),
    body("sex")
      .isIn(["Male", "Female"])
      .withMessage("Sex must be Male or Female"),
    body("size")
      .isIn(["Small", "Medium", "Large"])
      .withMessage("Size must be Small, Medium, or Large"),
    body("color").notEmpty().withMessage("Color is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("personality").isArray().withMessage("Personality must be an array"),
    body("location").notEmpty().withMessage("Location is required"),
    body("adoption_fee")
      .isFloat({ min: 0 })
      .withMessage("Valid adoption fee is required"),
    body("intake_date")
      .isISO8601()
      .withMessage("Valid intake date is required"),
    body("posted_date")
      .isISO8601()
      .withMessage("Valid posted date is required"),
    body("vaccinated").isBoolean().withMessage("Vaccinated must be a boolean"),
    body("neutered").isBoolean().withMessage("Neutered must be a boolean"),
    body("good_with_children")
      .isBoolean()
      .withMessage("Good with children must be a boolean"),
    body("good_with_dogs")
      .isBoolean()
      .withMessage("Good with dogs must be a boolean"),
    body("good_with_cats")
      .isBoolean()
      .withMessage("Good with cats must be a boolean"),
    body("image_urls").isArray().withMessage("Image URLs must be an array"),
  ],
  createAnimal
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "foster"),
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("species")
      .optional()
      .notEmpty()
      .withMessage("Species cannot be empty"),
    body("breed").optional().notEmpty().withMessage("Breed cannot be empty"),
    body("age").optional().notEmpty().withMessage("Age cannot be empty"),
    body("sex")
      .optional()
      .isIn(["Male", "Female"])
      .withMessage("Sex must be Male or Female"),
    body("size")
      .optional()
      .isIn(["Small", "Medium", "Large"])
      .withMessage("Size must be Small, Medium, or Large"),
    body("color").optional().notEmpty().withMessage("Color cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("personality")
      .optional()
      .isArray()
      .withMessage("Personality must be an array"),
    body("location")
      .optional()
      .notEmpty()
      .withMessage("Location cannot be empty"),
    body("adoption_fee")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Valid adoption fee is required"),
    body("vaccinated")
      .optional()
      .isBoolean()
      .withMessage("Vaccinated must be a boolean"),
    body("neutered")
      .optional()
      .isBoolean()
      .withMessage("Neutered must be a boolean"),
    body("good_with_children")
      .optional()
      .isBoolean()
      .withMessage("Good with children must be a boolean"),
    body("good_with_dogs")
      .optional()
      .isBoolean()
      .withMessage("Good with dogs must be a boolean"),
    body("good_with_cats")
      .optional()
      .isBoolean()
      .withMessage("Good with cats must be a boolean"),
  ],
  updateAnimal
);

router.patch(
  "/:id/state",
  authMiddleware,
  [body("status").notEmpty().withMessage("Status is required")],
  updateAnimalState
);

// Assign interviewer (one animal -> one interviewer) admin only
router.patch(
  "/:id/interviewer",
  authMiddleware,
  roleMiddleware("admin"),
  [body("interviewer_id").isInt().withMessage("Valid interviewer_id required")],
  assignAnimalInterviewer
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteAnimal);

export default router;
