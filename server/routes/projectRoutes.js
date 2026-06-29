import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createProject,
  getMyProjects,
  getProjectById,
  acceptProject,
  rejectProject,
  updateProjectStatus,
} from "../controllers/projectController.js";


const router = express.Router();

router
  .route("/")
  .post(protect, createProject)
  .get(protect, getMyProjects);

router.get("/:id", protect, getProjectById);
router.patch("/:id/accept", protect, acceptProject);
router.patch("/:id/reject", protect, rejectProject);
router.patch("/:id/status", protect, updateProjectStatus);

export default router;