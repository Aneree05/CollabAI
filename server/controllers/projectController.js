import Project from "../models/Project.js";
import User from "../models/User.js";
import { PROJECT_STATUS } from "../constants/projectStatus.js";


export const createProject = async (req, res) => {
  try {
    const {
      freelancer,
      title,
      description,
      category,
      budget,
      deadline,
    } = req.body;

    // Only clients can create projects
    if (!req.user.roles.includes("client")) {
      return res.status(403).json({
        message: "Only clients can create projects.",
      });
    }

    // Check freelancer exists
    const assignedFreelancer = await User.findById(freelancer);

    if (!assignedFreelancer) {
      return res.status(404).json({
        message: "Freelancer not found.",
      });
    }

    // Check role
    if (
      !assignedFreelancer.roles.includes("freelancer") &&
      !assignedFreelancer.roles.includes("agency")
    ) {
      return res.status(400).json({
        message: "Selected user is not a freelancer or agency.",
      });
    }

    const project = await Project.create({
      client: req.user._id,
      freelancer,
      title,
      description,
      category,
      budget,
      deadline,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.roles.includes("client")) {
      projects = await Project.find({ client: req.user._id })
        .populate("freelancer", "name email profileImage");
    } else if (
      req.user.roles.includes("freelancer") ||
      req.user.roles.includes("agency")
    ) {
      projects = await Project.find({ freelancer: req.user._id })
        .populate("client", "name email profileImage");
    } else {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email profileImage")
      .populate("freelancer", "name email profileImage");

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const isClient =
      req.user.roles.includes("client") &&
      project.client._id.toString() === req.user._id.toString();

    const isFreelancer =
      (req.user.roles.includes("freelancer") ||
        req.user.roles.includes("agency")) &&
      project.freelancer._id.toString() === req.user._id.toString();

    const isAdmin = req.user.roles.includes("admin");

    if (!isClient && !isFreelancer && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized to view this project.",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const acceptProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    // Only assigned freelancer/agency can accept
    if (project.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not assigned to this project.",
      });
    }

    // Project must be pending
    if (project.status !== PROJECT_STATUS.PENDING) {
      return res.status(400).json({
        message: "Project cannot be accepted.",
      });
    }

    project.status = PROJECT_STATUS.ACCEPTED;

    await project.save();

    res.status(200).json({
      message: "Project accepted successfully.",
      project,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    // Only assigned freelancer/agency can reject
    if (project.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not assigned to this project.",
      });
    }

    // Only pending projects can be rejected
    if (project.status !== PROJECT_STATUS.PENDING) {
      return res.status(400).json({
        message: "Project cannot be rejected.",
      });
    }

    project.status = PROJECT_STATUS.CANCELLED;

    await project.save();

    res.status(200).json({
      message: "Project rejected successfully.",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    if (project.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not assigned to this project.",
      });
    }

    if (
      status !== PROJECT_STATUS.IN_PROGRESS &&
      status !== PROJECT_STATUS.COMPLETED
    ) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }

    if (
      project.status === PROJECT_STATUS.ACCEPTED &&
      status === PROJECT_STATUS.IN_PROGRESS
    ) {
      project.status = status;
    } else if (
      project.status === PROJECT_STATUS.IN_PROGRESS &&
      status === PROJECT_STATUS.COMPLETED
    ) {
      project.status = status;
    } else {
      return res.status(400).json({
        message: "Invalid status transition.",
      });
    }

    await project.save();

    res.status(200).json({
      message: "Project status updated successfully.",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};