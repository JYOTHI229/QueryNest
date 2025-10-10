import { Question } from "../models/questionModel.js";
import Answer from "../models/answerModel.js";
import getOpenAIAPIResponse from "../utils/openai.js"; 

// POST /questions/posted
export const postQuestion = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;

  if (!title || !description) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const newQuestion = await Question.create({
      title,
      description,
      askedBy: userId,
    });

    // Generate AI-powered answer
    const aiPrompt = `Provide a clear, factual, and concise answer to the following question:\n"${title}"\n\n${description}`;
    const aiResponse = await getOpenAIAPIResponse(aiPrompt);

    // Save AI answer as special entry
    await Answer.create({
      content: aiResponse,
      question: newQuestion._id,
      isAI: true,
    });


    res.status(201).json({
      message: "Question posted",
      question: newQuestion,
    });
  } catch (err) {
    res.status(400).json({
      message: "Unable to post question",
      error: err.message,
    });
  }
};

// GET /questions/my
export const getMyQuestions = async (req, res) => {
  try {
    console.log("🔍 Inside getMyQuestions Controller");
    console.log("👤 req.userId =", req.userId);

    const questions = await Question.find({ askedBy: req.userId }).sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch your questions",
      error: err.message,
    });
  }
};

// GET /questions/:id
export const question = async (req, res) => {
  try {
    const id = req.params.id;

    const foundQuestion = await Question.findById(id).populate("askedBy", "name email avatar");
    if (!foundQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(foundQuestion);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch question",
      error: err.message,
    });
  }
};

// GET /questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("askedBy", "name avatar _id followers following")
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions", error: err.message });
  }
};

// PUT /questions/:id
export const editQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.askedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to edit this question" });
    }

    question.title = title || question.title;
    question.description = description || question.description;
    await question.save();

    res.json({ message: "Question updated", question });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update question",
      error: err.message,
    });
  }
};

// DELETE /questions/:id
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.askedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this question" });
    }

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete question",
      error: err.message,
    });
  }
};

// GET /questions/search?query=...
export const searchQuestions = async (req, res) => {
  const { query } = req.query;

  try {
    const questions = await Question.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("askedBy", "name");

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({
      message: "Search failed",
      error: err.message,
    });
  }
};

// GET /questions/user/:userId
export const getQuestionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const questions = await Question.find({ askedBy: userId })
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user's questions",
      error: err.message,
    });
  }
};
