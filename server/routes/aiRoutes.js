import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  generateProjectScope,
  estimateProjectCost,
  recommendFreelancers,
} from "../controllers/aiController.js";


const router = express.Router();

router.post("/project-scope", protect, generateProjectScope);
router.post("/cost-estimator", protect, estimateProjectCost);
router.post("/recommend-freelancers", protect, recommendFreelancers);

export default router;