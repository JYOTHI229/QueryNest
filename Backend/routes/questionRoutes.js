import express from "express";
import { postQuestion, getAllQuestions , question  } from "../controllers/questionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posted", verifyToken, postQuestion);
router.get("/all", getAllQuestions);
router.get("/:id", question);

export default router;
