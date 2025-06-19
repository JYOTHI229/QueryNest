// routes/answerRoutes.js
import express from 'express';
import { postAnswer, getAnswers ,  updateAnswer, deleteAnswer } from '../controllers/answerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { voteOnAnswer } from '../controllers/voteController.js';

const router = express.Router();

router.post('/vote/:id', verifyToken, voteOnAnswer);
router.post('/:questionId', verifyToken , postAnswer);
router.get('/:questionId', getAnswers);
// PUT - Update answer
router.put("/:id", verifyToken, updateAnswer);

// DELETE - Delete answer
router.delete("/:id", verifyToken, deleteAnswer);

export default router;
