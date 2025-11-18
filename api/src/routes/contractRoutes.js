import express from "express";
import {
  getAllContracts,
  getContractById,
  getContractsByAnimal,
  createContract,
  updateContract,
  deleteContract,
  getContractByToken,
  submitContractByToken,
} from "../controller/contractController.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import { body, param } from "express-validator";

const router = express.Router();

// Create contract - open to everyone (public)
router.post(
  "/",
  [
    body("application_id")
      .isInt()
      .withMessage("Valid application ID is required"),
    body("payment_proof").notEmpty().withMessage("Payment proof is required"),
    body("signature")
      .optional()
      .notEmpty()
      .withMessage("Signature cannot be empty"),
  ],
  createContract
);

// Admin-only routes
router.get("/", authMiddleware, roleMiddleware("admin"), getAllContracts);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [param("id").isInt().withMessage("Valid contract ID is required")],
  getContractById
);
router.get(
  "/animal/:animalId",
  authMiddleware,
  roleMiddleware("admin"),
  [param("animalId").notEmpty().withMessage("Animal ID is required")],
  getContractsByAnimal
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [param("id").isInt().withMessage("Valid contract ID is required")],
  updateContract
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [param("id").isInt().withMessage("Valid contract ID is required")],
  deleteContract
);

// Public routes for token-based contract access (no authentication required)
router.get(
  "/token/:token",
  [param("token").notEmpty().withMessage("Token is required")],
  getContractByToken
);

router.post(
  "/token/:token/submit",
  [
    param("token").notEmpty().withMessage("Token is required"),
    body("payment_proof").notEmpty().withMessage("Payment proof is required"),
    body("signature").notEmpty().withMessage("Signature is required"),
  ],
  submitContractByToken
);

export default router;
