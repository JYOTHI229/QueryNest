
import Answer from '../models/answerModel.js';

export const postAnswer = async (req, res) => {
  const { content } = req.body;
  const { questionId } = req.params;

  if (!content) return res.status(400).json({ message: 'Answer content is required' });

  try {
    const answer = await Answer.create({
      content,
      answeredBy: req.userId,
      question: questionId,
    });

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Error posting answer', error: err.message });
  }
};

export const getAnswers = async (req, res) => {
  const { questionId } = req.params;

  try {
    const answers = await Answer.find({ question: questionId })
      .populate('answeredBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching answers', error: err.message });
  }
};
