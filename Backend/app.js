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

// Connect to MongoDB
connectDB();

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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

// Root route
app.get("/", (req, res) => {
  res.send("hello");
});

// Error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ error: message });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
