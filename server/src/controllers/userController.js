import User from "../models/User.js";

const createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      phone
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
  } catch (error) {
    console.error("Create user error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
};

export { createUser };