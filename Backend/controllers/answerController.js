import Answer from '../models/answerModel.js';
import {mongoose} from 'mongoose';

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




export const getAnswersByUser = async (req, res) => {
  const { userId } = req.params;

  // Validatation of  ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const answers = await Answer.find({ answeredBy: userId })
      .populate("question", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's answers", error: err.message });
  }
};



// Getting answers
export const getAnswers = async (req, res) => {
  const { questionId } = req.params;

  try {
    const answers = await Answer.find({ question: questionId })
      .populate('answeredBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching answers', error: err.message });
  }
};


//  Update an answer
export const updateAnswer = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.answeredBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own answer" });
    }

    answer.content = content;
    await answer.save();

    res.status(200).json({ message: "Answer updated", answer });
  } catch (err) {
    res.status(500).json({ message: "Failed to update answer", error: err.message });
  }
};

// Delete an answer
export const deleteAnswer = async (req, res) => {
  const { id } = req.params;

  try {
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.answeredBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own answer" });
    }

    await answer.deleteOne();
    res.status(200).json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete answer", error: err.message });
  }
};
