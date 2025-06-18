import express from "express";
import { postQuestion, getAllQuestions , question , getMyQuestions , editQuestion,
    deleteQuestion } from "../controllers/questionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posted", verifyToken, postQuestion);
router.get("/all", getAllQuestions);
router.get('/my', verifyToken, getMyQuestions);
router.get("/:id", question);
router.put('/:id', verifyToken, editQuestion);
router.delete('/:id', verifyToken, deleteQuestion);


export default router;
