import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Helpers
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  };
  
  const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  };
  
//Register 
export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const existing = await User.findOne({ email });
      if (existing){
        return res.status(400).json({ message: "User already exists" });
      } 
  
      const user = await User.create({
         name,
         email,
         password
        });
     if(user){
        res.status(201).json({ message: "Registered successfully" });
     }
      
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


// Login
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
  
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
  
      res.status(200).json({ 
        message: "Logged in successfully", 
        user: { id: user._id, name: user.name, email: user.email }
      });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Refresh Token
export const RefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
  
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(payload.id);
  
      if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403);
  
      const newAccessToken = generateAccessToken(user._id);
  
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000
      });
  
      res.json({ message: "Access token refreshed" });
    } catch (err) {
      res.sendStatus(403);
    }
  };




// Logout
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
  
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(payload.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
  
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({ message: "Logged out successfully" });
    } catch (err) {
      res.sendStatus(403);
    }
  };
  