import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api";

import {
  Typography,
  Container,
  Card,
  Box,
  Stack,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import moment from "moment";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followStats, setFollowStats] = useState({});

  const fetchFollowStats = async (userIds) => {
    try {
      const statsRes = await api.post("/user/follow-stats", { userIds });
      setFollowStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching follow stats:", err);
    }
  };

  const fetchFollowedUsers = async () => {
    try {
      const followRes = await api.get("/user/following");
      setFollowedUsers(followRes.data.followingIds);
    } catch (err) {
      console.error("Error fetching followed users:", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/questions/all");
      setQuestions(res.data);

      const userIds = [...new Set(res.data.map((q) => q.askedBy?._id))];
      await fetchFollowStats(userIds);

      if (user) await fetchFollowedUsers();
    } catch (err) {
      console.error("Error fetching questions:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [user]);

  const handleVote = async (id, voteValue) => {
    try {
      const res = await api.post(`/questions/vote/${id}`, { vote: voteValue });
      const updated = res.data;
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === id ? { ...q, upvotes: updated.upvotes, downvotes: updated.downvotes } : q
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Login required to vote");
    }
  };

  const toggleFollow = async (userId) => {
    try {
      if (!user || user._id === userId) return;

      const isFollowing = followedUsers.includes(userId);
      if (isFollowing) {
        await api.put(`/user/unfollow/${userId}`);
        setFollowedUsers((prev) => prev.filter((id) => id !== userId));
        setFollowStats((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            followers: (prev[userId]?.followers || 1) - 1,
          },
        }));
      } else {
        await api.put(`/user/follow/${userId}`);
        setFollowedUsers((prev) => [...prev, userId]);
        setFollowStats((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            followers: (prev[userId]?.followers || 0) + 1,
          },
        }));
      }
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }} maxWidth="md">
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Top Questions
      </Typography>

      {questions.length === 0 ? (
        <Typography>No questions yet. Be the first to ask!</Typography>
      ) : (
        <Stack spacing={3}>
          {questions.map((q) => (
            <Card
              key={q._id}
              elevation={2}
              sx={{ borderRadius: 3, width: "100%", px: 2, py: 2 }}
            >
              {/* User Info Row */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    alt={q.askedBy?.name}
                    src={q.askedBy?.avatar || "https://i.ibb.co/2d8L5F0/default-avatar.png"}
                    sx={{ width: 36, height: 36, cursor: "pointer" }}
                    onClick={() => navigate(`/users/${q.askedBy?._id}`)}
                  />
                  <Box>
                    <Typography
                      fontSize={14}
                      fontWeight={600}
                      sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                      onClick={() => navigate(`/users/${q.askedBy?._id}`)}
                    >
                      {q.askedBy?.name || "Anonymous"}
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      {followStats[q.askedBy?._id]?.followers ?? 0} Followers •{" "}
                      {followStats[q.askedBy?._id]?.following ?? 0} Following
                    </Typography>
                  </Box>
                </Box>

                {user && user._id !== q.askedBy?._id && (
                  <Button
                    size="small"
                    variant={
                      followedUsers.includes(q.askedBy._id) ? "outlined" : "contained"
                    }
                    onClick={() => toggleFollow(q.askedBy._id)}
                    sx={{
                      textTransform: "none",
                      fontSize: "12px",
                      px: 2,
                      borderRadius: "20px",
                      fontWeight: "bold",
                      backgroundColor: followedUsers.includes(q.askedBy._id)
                        ? "white"
                        : "#1976d2",
                      color: followedUsers.includes(q.askedBy._id)
                        ? "#1976d2"
                        : "white",
                      border: followedUsers.includes(q.askedBy._id)
                        ? "1px solid #1976d2"
                        : "none",
                      "&:hover": {
                        backgroundColor: followedUsers.includes(q.askedBy._id)
                          ? "#f0f0f0"
                          : "#1251a0",
                      },
                    }}
                  >
                    {followedUsers.includes(q.askedBy._id) ? "Following" : "Follow"}
                  </Button>
                )}
              </Box>

              {/* Question Title */}
              <Typography
                variant="subtitle1"
                component={Link}
                to={`/questions/${q._id}`}
                sx={{
                  mt: 2,
                  textDecoration: "none",
                  color: "primary.main",
                  fontWeight: "bold",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {q.title}
              </Typography>

              {/* Question Description */}
              <Typography sx={{ mt: 1 }}>{q.description}</Typography>

              {/* Timestamp */}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Posted {moment(q.createdAt).fromNow()}
              </Typography>

              {/* Voting Section */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={() => handleVote(q._id, 1)} color="primary">
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{q.upvotes || 0}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={() => handleVote(q._id, -1)} color="error">
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{q.downvotes || 0}</Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Home;
