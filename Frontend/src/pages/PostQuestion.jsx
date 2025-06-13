import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/PostQuestion.css"; // Link to CSS file

const PostQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      await api.post("/questions/posted", { title, description });
      alert("Question posted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error posting question:", err.response?.data || err.message);
      alert("Failed to post question.");
    }
  };

  return (
    <div className="post-question-container">
      <h2 className="post-question-heading">Ask a Question</h2>
      <form onSubmit={handleSubmit} className="post-question-form">
        <input
          type="text"
          placeholder="Question Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe your question"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Post Question</button>
      </form>
    </div>
  );
};

export default PostQuestion;
