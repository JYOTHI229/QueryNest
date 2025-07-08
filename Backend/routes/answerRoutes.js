import express from 'express';
import {
  postAnswer,
  getAnswers,
  updateAnswer,
  deleteAnswer,
  getAnswersByUser
} from '../controllers/answerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { voteOnAnswer } from '../controllers/voteController.js';

const router = express.Router();


router.post('/vote/:id', verifyToken, voteOnAnswer);

// Specific route for user answers
router.get("/user/:userId", getAnswersByUser);

// CRUD for answer by questionId 
router.post('/:questionId', verifyToken , postAnswer);
router.get('/:questionId', getAnswers);

router.put("/:id", verifyToken, updateAnswer);
router.delete("/:id", verifyToken, deleteAnswer);

export default router;
