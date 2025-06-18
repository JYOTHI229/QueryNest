import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const QuestionDetails = () => {
  const { id } = useParams(); // /questions/:id
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  // Fetch question + answers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resQ = await api.get(`/questions/${id}`);
        setQuestion(resQ.data);

        const resA = await api.get(`/answers/${id}`);
        setAnswers(resA.data);
      } catch (err) {
        console.error("❌ Error loading question or answers:", err);
      }
    };

    fetchData();
  }, [id]);

  // Submit a new answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      const res = await api.post(`/answers/${id}`, { content: newAnswer });
      setAnswers([res.data, ...answers]); // Prepend
      setNewAnswer("");
    } catch (err) {
      console.error("❌ Failed to submit answer:", err);
      alert(err.response?.data?.message || "Error posting answer");
    }
  };

  // Delete Question
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/questions/${question._id}`);
      alert("Question deleted");
      navigate("/questions");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting question");
    }
  };

  // UI
  return (
    <div style={{ padding: "20px" }}>
      {question ? (
        <>
          {/* Question Info */}
          <h2>{question.title}</h2>
          <p>{question.description}</p>
          <p>
            <strong>Asked by:</strong> {question.askedBy?.name || "Anonymous"}
          </p>

          {/* Edit/Delete if owner */}
          {user && question.askedBy?._id === user._id && (
            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => navigate(`/questions/edit/${question._id}`)}>Edit</button>
              <button
                onClick={handleDelete}
                style={{ marginLeft: "1rem", backgroundColor: "#f44336", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          )}

          <hr />

          {/* Answers */}
          <h3>Answers</h3>
          {answers.length === 0 ? (
            <p>No answers yet. Be the first to answer!</p>
          ) : (
            answers.map((a) => (
              <div
                key={a._id}
                style={{
                  marginBottom: "1rem",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "1rem",
                }}
              >
                <p>{a.content}</p>
                <p>
                  <strong>Answered by:</strong> {a.answeredBy?.name || "Anonymous"}
                </p>
              </div>
            ))
          )}

          {/* Answer form */}
          {user && (
            <>
              <hr />
              <h4>Your Answer</h4>
              <form onSubmit={handleAnswerSubmit}>
                <textarea
                  rows="4"
                  style={{ width: "100%" }}
                  placeholder="Write your answer here..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  required
                />
                <br />
                <button type="submit" style={{ marginTop: "0.5rem" }}>
                  Submit Answer
                </button>
              </form>
            </>
          )}
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default QuestionDetails;
