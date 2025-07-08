// src/pages/PostQuestion.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Box
} from "@mui/material";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const MAX_TITLE_LENGTH = 100;
const MAX_DESC_LENGTH = 1000;

const PostQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length > MAX_TITLE_LENGTH || description.length > MAX_DESC_LENGTH) {
      return alert("Title or description exceeds allowed length.");
    }

    try {
      setLoading(true);
      await api.post("/questions/posted", { title, description });
      alert("Question posted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error posting question:", err.response?.data || err.message);
      alert("Failed to post question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Ask a Question
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Question Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                inputProps={{ maxLength: MAX_TITLE_LENGTH }}
                helperText={`${title.length}/${MAX_TITLE_LENGTH} characters`}
              />
              <TextField
                label="Description (Markdown supported)"
                variant="outlined"
                multiline
                rows={6}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                inputProps={{ maxLength: MAX_DESC_LENGTH }}
                helperText={`${description.length}/${MAX_DESC_LENGTH} characters`}
              />

              {/* Live Markdown Preview */}
              {description && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Live Preview:</Typography>
                  <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
                    <ReactMarkdown>{description}</ReactMarkdown>
                  </Paper>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Post Question"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default PostQuestion;
