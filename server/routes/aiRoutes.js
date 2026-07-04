import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateProjectScope } from "../controllers/aiController.js";

const router = express.Router();

router.post("/project-scope", protect, generateProjectScope);

export default router;