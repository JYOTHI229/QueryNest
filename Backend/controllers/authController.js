import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Token Generators
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// Register Controller
export const Register = async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!name || !email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.create({
      name,
      email,
      password,
      username,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login Controller
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res
       .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 15 * 60 * 1000,
        })
       .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
      .status(200)
      .json({
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const RefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("🔐 Received refreshToken:", refreshToken);
  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    console.log("👤 Found user:", user?.email);

    if (!user || user.refreshToken !== refreshToken) {
      console.log("❌ Refresh token mismatch");
      return res.sendStatus(403);
    }

    const newAccessToken = generateAccessToken(user._id);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    console.log("✅ Access token refreshed");
    res.json({ message: "Access token refreshed" });
  } catch (err) {
    console.error("❌ Refresh error:", err.message);
    res.sendStatus(403);
  }
};

// Logout Controller
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204); // No Content

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res
      .clearCookie("accessToken", { sameSite: "None", secure: true })
      .clearCookie("refreshToken", { sameSite: "None", secure: true })
      .json({ message: "Logged out successfully" });
  } catch {
    res.sendStatus(403);
  }
};
