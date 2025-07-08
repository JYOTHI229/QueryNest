import express from "express";
import {
  postQuestion,
  getAllQuestions,
  question,
  getMyQuestions,
  editQuestion,
  deleteQuestion,
  searchQuestions,
  getQuestionsByUser
} from "../controllers/questionController.js";
import { voteOnQuestion } from "../controllers/voteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Protected: Ask a new question
router.post("/posted", verifyToken, postQuestion);

// 🔐 Protected: Get questions posted by the logged-in user
router.get("/my", verifyToken, getMyQuestions);

// 🔐 Protected: Vote on a question
router.post("/vote/:id", verifyToken, voteOnQuestion);

// 🔓 Public: Search questions by title or description
router.get("/search", searchQuestions);

// 🔓 Public: Get all questions
router.get("/all", getAllQuestions);

router.get("/user/:userId", getQuestionsByUser);

// 🔓 Public: Get details of a single question
router.get("/:id", question);

// 🔐 Protected: Edit a question (only by its owner)
router.put("/:id", verifyToken, editQuestion);

// 🔐 Protected: Delete a question (only by its owner)
router.delete("/:id", verifyToken, deleteQuestion);

export default router;
