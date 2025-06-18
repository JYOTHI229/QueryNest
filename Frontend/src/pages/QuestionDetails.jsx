import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const QuestionDetails = () => {
  const { id } = useParams(); // This should match your route path: /questions/:id
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resQ = await api.get(`/questions/${id}`);
        setQuestion(resQ.data);

        const resA = await api.get(`/answers/${id}`);
        setAnswers(resA.data);
      } catch (err) {
        console.error("Error loading question or answers:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      const res = await api.post(`/answers/${id}`, { content: newAnswer });
      setAnswers([res.data, ...answers]); // Add new answer to top
      setNewAnswer(""); // Clear textarea
    } catch (err) {
      console.error("Failed to submit answer:", err);
      alert(err.response?.data?.message || "Error posting answer");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {question ? (
        <>
          <h2>{question.title}</h2>
          <p>{question.description}</p>
          <p>
            <strong>Asked by:</strong> {question.askedBy?.name || "Anonymous"}
          </p>

          <hr />
          <h3>Answers</h3>

          {answers.length === 0 ? (
            <p>No answers yet. Be the first to answer!</p>
          ) : (
            answers.map((a) => (
              <div key={a._id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
                <p>{a.content}</p>
                <p>
                  <strong>Answered by:</strong> {a.answeredBy?.name || "Anonymous"}
                </p>
              </div>
            ))
          )}

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
                <button type="submit">Submit Answer</button>
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
