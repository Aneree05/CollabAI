import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    uploadFile,
    getProjectFiles,
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

router.get("/:projectId", protect, getProjectFiles);

export default router;