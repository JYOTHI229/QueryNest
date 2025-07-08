// src/components/UserAnswers.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Typography,
  Stack,
  Card,
  Box,
} from "@mui/material";
import moment from "moment";

const UserAnswers = ({ userId }) => {
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await api.get(`/answers/user/${userId}`);
        setAnswers(res.data);
      } catch (err) {
        console.error("❌ Error fetching answers:", err);
      }
    };

    if (userId) fetchAnswers();
  }, [userId]);

  if (!answers.length) {
    return <Typography>No answers found for this user.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {answers.map((ans) => (
        <Card
          key={ans._id}
          sx={{ p: 2, cursor: "pointer" }}
          onClick={() => navigate(`/questions/${ans.question?._id}`)}
        >
          <Box>
            <Typography variant="h6">{ans.question?.title}</Typography>
            <Typography>{ans.text}</Typography>
            <Typography variant="caption" color="text.secondary">
              Answered on {moment(ans.createdAt).format("MMM D, YYYY")}
            </Typography>
          </Box>
        </Card>
      ))}
    </Stack>
  );
};

export default UserAnswers;
