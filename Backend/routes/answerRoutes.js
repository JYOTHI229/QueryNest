// routes/answerRoutes.js
import express from 'express';
import { postAnswer, getAnswers } from '../controllers/answerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:questionId', verifyToken , postAnswer);
router.get('/:questionId', getAnswers);

export default router;
