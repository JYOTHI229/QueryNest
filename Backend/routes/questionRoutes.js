import express from "express";
import { postQuestion, getAllQuestions } from "../controllers/questionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posted", verifyToken, postQuestion);
router.get("/all", getAllQuestions);

export default router;
