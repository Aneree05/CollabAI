import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createProject,
  getMyProjects,
  getProjectById,
} from "../controllers/projectController.js";


const router = express.Router();

router
  .route("/")
  .post(protect, createProject)
  .get(protect, getMyProjects);

router.get("/:id", protect, getProjectById);

export default router;