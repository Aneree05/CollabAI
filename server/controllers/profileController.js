import validator from "validator";


export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      skills,
      experience,
      portfolio,
      profileImage,
    } = req.body;

    if (name && name.trim() === "") {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({
        message: "Skills must be an array",
      });
    }

    if (portfolio && !validator.isURL(portfolio)) {
      return res.status(400).json({
        message: "Portfolio must be a valid URL",
      });
    }

    const user = req.user;

    if (name) user.name = name;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (portfolio) user.portfolio = portfolio;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};