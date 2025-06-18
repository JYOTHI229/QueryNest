import { Question } from "../models/questionModel.js";

export const postQuestion = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId; // ✅ Comes from verifyToken
    
    if (!title || !description) {
        return res.status(400).json({ message: "All fields required" });
      }

    
    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    
    try {
      const newQuestion = await Question.create({
        title,
        description,
        askedBy: userId // ✅ set from middleware
      });
      res.status(201).json({ message: "Question posted", newQuestion });
    } catch (err) {
      res.status(400).json({ message: "Unable to post question" });
    }
  };
  

// GET single question by ID
export const question = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("askedBy", "name email");
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch question" });
  }
};


export const getAllQuestions = async (req, res) => {
  const questions = await Question.find().populate("askedBy", "name");
  res.json(questions);
};



