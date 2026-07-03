import cloudinary from "../config/cloudinary.js";
import File from "../models/File.js";
import Project from "../models/Project.js";
import ActivityLog from "../models/ActivityLog.js";



export const uploadFile = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const isClient =
      project.client.toString() === req.user._id.toString();

    const isFreelancer =
      project.freelancer.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        message: "You are not part of this project.",
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "CollabAI",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    const file = await File.create({
      project: projectId,
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype.startsWith("image")
        ? "image"
        : req.file.mimetype === "application/pdf"
        ? "pdf"
        : "document",
    });

    await ActivityLog.create({
        project: projectId,
        user: req.user._id,
        action: "FILE_UPLOADED",
        description: `${req.user.name} uploaded ${req.file.originalname}`,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};