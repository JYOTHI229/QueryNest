import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

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
      setAnswers([res.data, ...answers]);
      setNewAnswer("");
    } catch (err) {
      console.error("Failed to submit answer:", err);
      alert(err.response?.data?.message || "Error posting answer");
    }
  };

  const handleAnswerVote = async (answerId, voteValue) => {
    try {
      const res = await api.post(`/answers/vote/${answerId}`, { vote: voteValue });
      const { upvotes, downvotes } = res.data;

      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId ? { ...a, upvotes, downvotes } : a
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Login required to vote");
    }
  };

  const handleEdit = (answer) => {
    setEditingAnswerId(answer._id);
    setEditedContent(answer.content);
  };

  const handleUpdateAnswer = async (answerId) => {
    try {
      await api.put(`/answers/${answerId}`, { content: editedContent });
      setAnswers((prev) =>
        prev.map((a) => (a._id === answerId ? { ...a, content: editedContent } : a))
      );
      setEditingAnswerId(null);
      setEditedContent("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update answer");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    const confirm = window.confirm("Are you sure you want to delete this answer?");
    if (!confirm) return;

    try {
      await api.delete(`/answers/${answerId}`);
      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete answer");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {question ? (
        <>
          <h2>{question.title}</h2>
          <p>{question.description}</p>
          <p><strong>Asked by:</strong> {question.askedBy?.name || "Anonymous"}</p>

          {user && question.askedBy?._id === user._id && (
            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => navigate(`/questions/edit/${question._id}`)}>Edit</button>
              <button
                onClick={async () => {
                  const confirm = window.confirm("Are you sure you want to delete this question?");
                  if (confirm) {
                    try {
                      await api.delete(`/questions/${question._id}`);
                      alert("Question deleted");
                      navigate("/questions");
                    } catch (err) {
                      alert(err.response?.data?.message || "Error deleting question");
                    }
                  }
                }}
                style={{ marginLeft: "1rem" }}
              >
                Delete
              </button>
            </div>
          )}

          <hr />
          <h3>Answers</h3>

          {answers.length === 0 ? (
            <p>No answers yet. Be the first to answer!</p>
          ) : (
            answers.map((a) => (
              <div key={a._id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
                {editingAnswerId === a._id ? (
                  <>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows="3"
                      style={{ width: "100%" }}
                    />
                    <button onClick={() => handleUpdateAnswer(a._id)}>Save</button>
                    <button onClick={() => setEditingAnswerId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p>{a.content}</p>
                    <p><strong>Answered by:</strong> {a.answeredBy?.name || "Anonymous"}</p>

                    <div style={{ marginTop: "0.5rem" }}>
                      <button onClick={() => handleAnswerVote(a._id, 1)}>👍</button>
                      <span style={{ margin: "0 10px" }}>Upvotes: {a.upvotes || 0}</span>
                      <button onClick={() => handleAnswerVote(a._id, -1)}>👎</button>
                      <span style={{ marginLeft: "10px" }}>Downvotes: {a.downvotes || 0}</span>
                    </div>

                    {user && a.answeredBy?._id === user._id && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <button onClick={() => handleEdit(a)} style={{ marginRight: "0.5rem" }}>Edit</button>
                        <button onClick={() => handleDeleteAnswer(a._id)}>Delete</button>
                      </div>
                    )}
                  </>
                )}
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
