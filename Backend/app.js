import dotenv from "dotenv";
dotenv.config();
import "./config/cloudinary.js";

import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

const app = express();
const port = process.env.PORT || 8000;

connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

// Test Route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend with proxy!" });
});

app.get("/", (req, res) => {
  res.send("hello");
});

// Error Middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ error: message });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
