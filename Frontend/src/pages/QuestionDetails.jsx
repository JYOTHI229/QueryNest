import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  Stack,
  Avatar,
} from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

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
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    try {
      await api.delete(`/answers/${answerId}`);
      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete answer");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await api.delete(`/questions/${question._id}`);
      alert("Question deleted");
      navigate("/questions");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting question");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      {question ? (
        <>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: {
                xs: "1.4rem",
                sm: "1.8rem",
                md: "2rem",
              },
              fontWeight: "bold",
            }}
          >
            {question.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              fontSize: {
                xs: "0.95rem",
                sm: "1rem",
                md: "1.15rem",
              },
              mb: 1,
            }}
          >
            {question.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Avatar
              src={question.askedBy?.avatar}
              alt={question.askedBy?.name || "A"}
              sx={{ width: 30, height: 30 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
            >
              Asked by: {question.askedBy?.name || "Anonymous"}
            </Typography>
          </Box>

          {user && question.askedBy?._id === user._id && (
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button variant="outlined" onClick={() => navigate(`/questions/edit/${question._id}`)}>
                Edit
              </Button>
              <Button variant="outlined" color="error" onClick={handleDeleteQuestion}>
                Delete
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
              fontWeight: 600,
            }}
          >
            Answers
          </Typography>

          {answers.length === 0 ? (
            <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              No answers yet. Be the first to answer!
            </Typography>
          ) : (
            <Stack spacing={3}>
              {answers.map((a) => (
                <Card key={a._id} sx={{ p: 2 }}>
                  <CardContent>
                    {editingAnswerId === a._id ? (
                      <>
                        <TextField
                          multiline
                          fullWidth
                          rows={3}
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button variant="contained" onClick={() => handleUpdateAnswer(a._id)}>
                            Save
                          </Button>
                          <Button variant="outlined" onClick={() => setEditingAnswerId(null)}>
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>{a.content}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                          <Avatar
                            src={a.answeredBy?.avatar}
                            alt={a.answeredBy?.name || "A"}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Answered by: {a.answeredBy?.name || "Anonymous"}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton onClick={() => handleAnswerVote(a._id, 1)} color="primary">
                            <ThumbUpIcon />
                          </IconButton>
                          <Typography variant="body2">Upvotes: {a.upvotes || 0}</Typography>

                          <IconButton onClick={() => handleAnswerVote(a._id, -1)} color="error">
                            <ThumbDownIcon />
                          </IconButton>
                          <Typography variant="body2">Downvotes: {a.downvotes || 0}</Typography>
                        </Box>

                        {user && a.answeredBy?._id === user._id && (
                          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                            <Button size="small" onClick={() => handleEdit(a)}>
                              Edit
                            </Button>
                            <Button size="small" color="error" onClick={() => handleDeleteAnswer(a._id)}>
                              Delete
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          {user && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                  fontWeight: 500,
                }}
              >
                Your Answer
              </Typography>
              <form onSubmit={handleAnswerSubmit}>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Write your answer here..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  required
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Submit Answer
                </Button>
              </form>
            </>
          )}
        </>
      ) : (
        <Typography>Loading question...</Typography>
      )}
    </Container>
  );
};

export default QuestionDetails;
