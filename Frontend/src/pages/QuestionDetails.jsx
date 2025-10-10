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
  CircularProgress,
  Paper,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // AI icon

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resQ = await api.get(`/questions/${id}`);
        setQuestion(resQ.data);

        const resA = await api.get(`/answers/${id}`);
        const allAnswers = resA.data;

        // Separate AI answer if exists
        const ai = allAnswers.find((a) => a.isAI);
        const userAnswers = allAnswers.filter((a) => !a.isAI);

        setAiAnswer(ai || null);
        setAnswers(userAnswers);
      } catch (err) {
        console.error("Error loading question or answers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      const res = await api.post(`/answers/${id}`, { content: newAnswer });
      setAnswers((prev) => [res.data, ...prev]);
      setNewAnswer("");
    } catch (err) {
      alert(err.response?.data?.message || "Error posting answer");
    }
  };

  const handleAnswerVote = async (answerId, voteValue) => {
    try {
      const res = await api.post(`/answers/vote/${answerId}`, { vote: voteValue });
      const { upvotes, downvotes } = res.data;

      // Update user answers
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId ? { ...a, upvotes, downvotes } : a
        )
      );

      // Update AI answer if it matches
      if (aiAnswer?._id === answerId) {
        setAiAnswer((prev) => ({ ...prev, upvotes, downvotes }));
      }
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

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      {question ? (
        <>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {question.title}
          </Typography>

          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
            {question.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Avatar
              src={question.askedBy?.avatar}
              alt={question.askedBy?.name || "A"}
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant="caption" color="text.secondary">
              Asked by: {question.askedBy?.name || "Anonymous"}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* --- AI Answer Section with Voting --- */}
          {aiAnswer && (
            <Paper
              elevation={4}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(25,118,210,0.1), rgba(25,118,210,0.05))",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SmartToyIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  AI Answer (QueryNest AI)
                </Typography>
              </Box>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {aiAnswer.content}
              </Typography>

              {/* Voting Buttons */}
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => handleAnswerVote(aiAnswer._id, 1)}
                  color="primary"
                >
                  <ThumbUpIcon />
                </IconButton>
                <Typography variant="body2">Upvotes: {aiAnswer.upvotes || 0}</Typography>

                <IconButton
                  onClick={() => handleAnswerVote(aiAnswer._id, -1)}
                  color="error"
                >
                  <ThumbDownIcon />
                </IconButton>
                <Typography variant="body2">
                  Downvotes: {aiAnswer.downvotes || 0}
                </Typography>
              </Box>
            </Paper>
          )}

          {/* --- User Answers --- */}
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Answers from the Community
          </Typography>

          {answers.length === 0 ? (
            <Typography>No user answers yet.</Typography>
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
                          <Button
                            variant="contained"
                            onClick={() => handleUpdateAnswer(a._id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setEditingAnswerId(null)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>
                          {a.content}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 1,
                            gap: 1,
                          }}
                        >
                          <Avatar
                            src={a.answeredBy?.avatar}
                            alt={a.answeredBy?.name || "A"}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Answered by: {a.answeredBy?.name || "Anonymous"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => handleAnswerVote(a._id, 1)}
                            color="primary"
                          >
                            <ThumbUpIcon />
                          </IconButton>
                          <Typography variant="body2">
                            Upvotes: {a.upvotes || 0}
                          </Typography>

                          <IconButton
                            onClick={() => handleAnswerVote(a._id, -1)}
                            color="error"
                          >
                            <ThumbDownIcon />
                          </IconButton>
                          <Typography variant="body2">
                            Downvotes: {a.downvotes || 0}
                          </Typography>
                        </Box>

                        {user && a.answeredBy?._id === user._id && (
                          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              onClick={() => handleEdit(a)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteAnswer(a._id)}
                            >
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

          {/* --- Answer Form --- */}
          {user && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" gutterBottom>
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
