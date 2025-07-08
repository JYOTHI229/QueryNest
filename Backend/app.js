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
const port = process.env.PORT ;
connectDB();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    secure:true  
  }));
  
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/answers', answerRoutes);

app.get("/api/hello",(req,res)=>{
    res.json({message:"Hello from backend with proxy!"});
})

app.get("/",async (req,res,next)=>{
    res.send("hello");
    next();
});

app.use((err,req,res,next)=>{
    const {status=500,message}=err;
    res.status(status).send(message);
    next();
})

app.listen(port,()=>{
    console.log(`app is listening at ${port}`);
})

