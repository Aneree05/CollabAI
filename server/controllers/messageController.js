import Message from "../models/Message.js";
import Project from "../models/Project.js";
import { getIO } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { projectId, message } = req.body;

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

    const receiver = isClient
      ? project.freelancer
      : project.client;

    const newMessage = await Message.create({
      project: projectId,
      sender: req.user._id,
      receiver,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name profileImage");

    const io = getIO();

    io.to(projectId).emit("receiveMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { projectId } = req.params;

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
        message: "You are not authorized to view this conversation.",
      });
    }

    const messages = await Message.find({
      project: projectId,
    })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};