import { useEffect, useState } from "react";
import api from "../api";
import { Typography, Stack, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

const UserQuestions = ({ userId }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/questions/user/${userId}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to load user questions:", err);
      }
    };

    fetchQuestions();
  }, [userId]);

  if (!userId) return null;

  return (
    <Stack spacing={2}>
      {questions.length === 0 ? (
        <Typography>No questions posted yet.</Typography>
      ) : (
        questions.map((q) => (
          <Card key={q._id}>
            <CardContent>
              <Link to={`/questions/${q._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <Typography variant="h6">{q.title}</Typography>
                <Typography>{q.description}</Typography>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
};

export default UserQuestions;
