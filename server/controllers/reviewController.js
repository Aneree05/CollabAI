import Review from "../models/Review.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";


export const createReview = async (req, res) => {
  try {
    const { projectId, rating, comment } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: req.user._id,
      freelancer: project.freelancer,
      rating,
      comment,
    });

    await Notification.create({
        user: project.freelancer,
        title: "New Review",
        message: `${req.user.name} has submitted a review for your project.`,
    });


    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};