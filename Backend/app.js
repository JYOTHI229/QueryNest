import dotenv from "dotenv";
dotenv.config();    

/* 
CLIENT_URL=https://querynest-1-02qk.onrender.com    will be this in production environment because 
in development environment  CLIENT_URL=http://localhost:5173 . We add the client url of production in the
render environment variables */ 

import path from "path";
import { fileURLToPath } from "url";

import "./config/cloudinary.js";
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Log origin for debugging
app.use((req, res, next) => {
  console.log(" Request Origin:", req.headers.origin);
  next();
});

const allowedOrigins = [process.env.CLIENT_URL ,  "http://localhost:5173"];

app.use(cors({
  origin: 
  function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(" Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

// Test Route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend with proxy!" });
});

app.get("/api/check-cookies", (req, res) => {
  res.json({ cookies: req.cookies });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Handle SPA routes (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

// Root route (optional, still works)
app.get("/", (req, res) => {
  res.send("QueryNest backend running!");
});

// Error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  console.error(" Error:", message);
  res.status(status).json({ error: message });
});

// Start server
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
  console.log(` CLIENT_URL: ${process.env.CLIENT_URL}`);
});
