// controllers/voteController.js
import { Question } from "../models/questionModel.js";
import  Answer  from "../models/answerModel.js";

export const voteOnQuestion = async (req, res) => {
  const { vote } = req.body; // 1 for upvote, -1 for downvote
  const userId = req.userId;
  const questionId = req.params.id;

  if (![1, -1].includes(vote)) {
    return res.status(400).json({ message: "Invalid vote value" });
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.votes.set(userId, vote); // Update the vote
    await question.save();

    // Re-fetch to calculate virtuals
    const updated = await Question.findById(questionId);

    res.status(200).json({
      message: "Vote recorded",
      upvotes: updated.upvotes,
      downvotes: updated.downvotes,
    });
  } catch (err) {
    res.status(500).json({ message: "Error voting", error: err.message });
  }
};



export const voteOnAnswer = async (req, res) => {
  const { id } = req.params; // answerId
  const { vote } = req.body; // 1 or -1
  const userId = req.userId;

  if (![1, -1].includes(vote)) {
    return res.status(400).json({ message: "Vote must be 1 (upvote) or -1 (downvote)" });
  }

  try {
    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.votes.get(userId) === vote) {
      answer.votes.delete(userId); // toggle
    } else {
      answer.votes.set(userId, vote);
    }

    await answer.save();

    res.status(200).json({
      message: "Vote updated",
      upvotes: answer.upvotes,
      downvotes: answer.downvotes,
    });
  } catch (err) {
    res.status(500).json({ message: "Voting failed", error: err.message });
  }
};
