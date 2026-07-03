import ActivityLog from "../models/ActivityLog.js";
import Project from "../models/Project.js";

export const getProjectActivity = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const activities = await ActivityLog.find({
      project: projectId,
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};