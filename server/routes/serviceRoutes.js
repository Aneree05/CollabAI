import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Service
router
  .route("/")
  .get(getServices)
  .post(protect, createService);

router
  .route("/:id")
  .get(getServiceById)
  .put(protect, updateService)
  .delete(protect, deleteService);

export default router;