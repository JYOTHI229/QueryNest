import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';

import { ExpressError } from "./utils/ExpressError.js";
import { wrapAsync } from "./utils/wrapAsync.js";

const app = express();
const port = process.env.PORT ;
connectDB();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    secure:false
  }));
  
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get("/auth",(req,res)=>{
    res.send("Authentication");
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

