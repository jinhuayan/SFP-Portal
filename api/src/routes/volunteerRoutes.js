import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import {
  listVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getTotalVolunteersCount,
} from "../controller/volunteerController.js";

const router = express.Router();

// Public route
router.get("/stats/total", getTotalVolunteersCount);

// All volunteer CRUD operations require admin role
router.get("/", authMiddleware, roleMiddleware("admin"), listVolunteers);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getVolunteer);
router.post("/", authMiddleware, roleMiddleware("admin"), createVolunteer);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateVolunteer);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteVolunteer);

export default router;
