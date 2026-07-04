import Project from "../models/Project.js";
import Service from "../models/Service.js";
import User from "../models/User.js";



export const getClientDashboard = async (req, res) => {
  try {
    const projects = await Project.find({
      client: req.user._id,
    });

    res.status(200).json({
      totalProjects: projects.length,
      pendingProjects: projects.filter(
        (p) => p.status === "Pending"
      ).length,
      activeProjects: projects.filter(
        (p) => p.status === "In Progress"
      ).length,
      completedProjects: projects.filter(
        (p) => p.status === "Completed"
      ).length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getFreelancerDashboard = async (req, res) => {
  try {
    const projects = await Project.find({
      freelancer: req.user._id,
    });

    const services = await Service.find({
      user: req.user._id,
    });

    res.status(200).json({
      totalServices: services.length,
      activeProjects: projects.filter(
        (p) => p.status === "In Progress"
      ).length,
      completedProjects: projects.filter(
        (p) => p.status === "Completed"
      ).length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalServices = await Service.countDocuments();

    res.status(200).json({
      totalUsers,
      totalProjects,
      totalServices,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};