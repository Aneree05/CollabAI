import Service from "../models/Service.js";

export const createService = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      pricing,
      deliveryTimeline,
    } = req.body;

    // Role validation
    if (
      !req.user.roles.includes("freelancer") &&
      !req.user.roles.includes("agency")
    ) {
      return res.status(403).json({
        message: "Only freelancers and agencies can create services",
      });
    }

    // Field validations
    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    if (pricing <= 0) {
      return res.status(400).json({
        message: "Pricing must be greater than 0",
      });
    }

    if (deliveryTimeline < 1) {
      return res.status(400).json({
        message: "Delivery timeline must be at least 1 day",
      });
    }

    const service = await Service.create({
      freelancer: req.user._id,
      title,
      category,
      description,
      pricing,
      deliveryTimeline,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
    } = req.query;

    let filter = {};

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.pricing = {};

      if (minPrice) {
        filter.pricing.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.pricing.$lte = Number(maxPrice);
      }
    }

    // Filter by minimum rating
    if (rating) {
      filter.rating = {
        $gte: Number(rating),
      };
    }

    const services = await Service.find(filter).populate(
      "freelancer",
      "name email profileImage"
    );

    res.status(200).json({
      message: "Services fetched successfully",
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "freelancer",
      "name email profileImage"
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service fetched successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Ownership check
    if (service.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this service",
      });
    }

    const {
      title,
      category,
      description,
      pricing,
      deliveryTimeline,
    } = req.body;

    // Validations
    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({
        message: "Title cannot be empty",
      });
    }

    if (category !== undefined && category.trim() === "") {
      return res.status(400).json({
        message: "Category cannot be empty",
      });
    }

    if (description !== undefined && description.trim() === "") {
      return res.status(400).json({
        message: "Description cannot be empty",
      });
    }

    if (pricing !== undefined && pricing <= 0) {
      return res.status(400).json({
        message: "Pricing must be greater than 0",
      });
    }

    if (deliveryTimeline !== undefined && deliveryTimeline < 1) {
      return res.status(400).json({
        message: "Delivery timeline must be at least 1 day",
      });
    }

    if (title) service.title = title;
    if (category) service.category = category;
    if (description) service.description = description;
    if (pricing !== undefined) service.pricing = pricing;
    if (deliveryTimeline !== undefined)
      service.deliveryTimeline = deliveryTimeline;

    await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Ownership check
    if (service.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this service",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};