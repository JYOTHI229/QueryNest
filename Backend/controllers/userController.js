import jwt from 'jsonwebtoken';
import {User} from "../models/userModel.js";


// Get Profile

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//update profile

export const updateProfile = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;

    // Avoid duplicate emails
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();
    res.json({ message: "Profile updated successfully", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
