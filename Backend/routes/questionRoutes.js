import express from "express";
import {
  postQuestion,
  getAllQuestions,
  question,
  getMyQuestions,
  editQuestion,
  deleteQuestion,
  searchQuestions
} from "../controllers/questionController.js";
import { voteOnQuestion } from "../controllers/voteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posted", verifyToken, postQuestion);
router.get("/all", getAllQuestions);
router.get("/search", searchQuestions);
router.get("/my", verifyToken, getMyQuestions);
router.post("/vote/:id", verifyToken, voteOnQuestion); // ✅ moved up

router.get("/:id", question);
router.put("/:id", verifyToken, editQuestion);
router.delete("/:id", verifyToken, deleteQuestion);

export default router;
