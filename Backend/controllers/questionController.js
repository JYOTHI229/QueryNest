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
  

  // controller/questionController.js
export const getMyQuestions = async (req, res) => {
  try {
    console.log("🔍 Inside getMyQuestions Controller");
    console.log("👤 req.userId =", req.userId); // This should not be undefined

    const questions = await Question.find({ askedBy: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch your questions',
      error: err.message,
    });
  }
};


export const question = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Fetching question with ID:", id);

    const question = await Question.findById(id).populate("askedBy", "name email");
    if (!question) return res.status(404).json({ message: "Question not found" });

    res.json(question);
  } catch (err) {
    console.error("❌ Error fetching question:", err.message);
    res.status(500).json({ message: "Failed to fetch question", error: err.message });
  }
};



export const getAllQuestions = async (req, res) => {
  const questions = await Question.find().populate("askedBy", "name");
  res.json(questions);
};

// Edit a question
export const editQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const question = await Question.findById(id);

    if (!question) return res.status(404).json({ message: "Question not found" });
    if (question.askedBy.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorized to edit this question" });

    question.title = title || question.title;
    question.description = description || question.description;
    await question.save();

    res.json({ message: "Question updated", question });
  } catch (err) {
    res.status(500).json({ message: "Failed to update question", error: err.message });
  }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    if (question.askedBy.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorized to delete this question" });

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question", error: err.message });
  }
};


