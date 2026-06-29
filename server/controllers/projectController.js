import Project from "../models/Project.js";
import User from "../models/User.js";

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