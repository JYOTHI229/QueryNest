import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyQuestions = async () => {
      if (!user) return;

      try {
        const res = await api.get("/questions/my");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching your questions:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuestions();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete question");
    }
  };

  if (!user || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Questions
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/ask")}>
          Ask a Question
        </Button>
      </Box>

      {questions.length === 0 ? (
        <Typography>You haven't posted any questions yet.</Typography>
      ) : (
        <Stack spacing={3}>
          {questions.map((q) => (
            <Card key={q._id} elevation={2} sx={{ p: 2, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/questions/${q._id}`}
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                      wordBreak: "break-word",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {q.title}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => navigate(`/edit-question/${q._id}`)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(q._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ wordBreak: "break-word" }}>{q.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MyQuestions;
