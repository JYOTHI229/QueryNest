// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import {
  Container,
  Typography,
  Avatar,
  Button,
  Stack,
  CircularProgress,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import UserQuestions from "../components/UserQuestions";
import UserAnswers from "../components/UserAnswers";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isOwnProfile = !id;

  useEffect(() => {
    const fetchData = async () => {
      const profileRes = await api.get(isOwnProfile ? "/user/profile" : `/user/public/${id}`);
      setUser(profileRes.data);

      const followersRes = await api.get(`/user/public/${isOwnProfile ? profileRes.data._id : id}`);
      setFollowersList(followersRes.data.followers || []);
      setFollowingList(followersRes.data.following || []);

      const authRes = await api.get("/user/profile");
      setAuthUser(authRes.data);
    };

    fetchData();
  }, [id]);

  const handleAvatarUpload = async (e) => {
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    const res = await api.put("/user/upload-avatar", formData);
    setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
  };

  const handleFollow = async (targetId) => {
    await api.put(`/user/follow/${targetId}`);
    refreshProfile();
  };

  const handleUnfollow = async (targetId) => {
    await api.put(`/user/unfollow/${targetId}`);
    refreshProfile();
  };

  const refreshProfile = async () => {
    const profileRes = await api.get(isOwnProfile ? "/user/profile" : `/user/public/${id}`);
    setUser(profileRes.data);

    const followersRes = await api.get(`/user/public/${isOwnProfile ? profileRes.data._id : id}`);
    setFollowersList(followersRes.data.followers || []);
    setFollowingList(followersRes.data.following || []);

    const authRes = await api.get("/user/profile");
    setAuthUser(authRes.data);
  };

  if (!user || !authUser) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  const isFollowing = authUser.following?.some((id) => id === user._id || id._id === user._id);

  const renderUserRow = (person) => {
    const isFollowingPerson = authUser.following?.some((f) => f === person._id || f._id === person._id);

    return (
      <Stack key={person._id} direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={1}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${person._id}`)}>
          <Avatar src={person.avatar} sx={{ width: 32, height: 32 }} />
          <Stack>
            <Typography fontSize="0.9rem">{person.name}</Typography>
            <Typography fontSize="0.75rem" color="text.secondary">@{person.username}</Typography>
          </Stack>
        </Stack>

        {authUser._id !== person._id && (
          isFollowingPerson ? (
            <Button size="small" variant="outlined" onClick={() => handleUnfollow(person._id)}>
              Following
            </Button>
          ) : (
            <Button size="small" variant="contained" onClick={() => handleFollow(person._id)}>
              Follow
            </Button>
          )
        )}
      </Stack>
    );
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 1000,
          backgroundColor: "#fff",
          pb: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar src={user.avatar} sx={{ width: 56, height: 56 }} />

          <Stack spacing={0.5}>
            <Typography fontSize="0.95rem" fontWeight={600}>{user.name}</Typography>
            <Typography fontSize="0.8rem" color="text.secondary">@{user.username}</Typography>

            <Stack direction="row" spacing={2}>
              <Typography fontSize="0.8rem"><strong>{followersList.length}</strong> Followers</Typography>
              <Typography fontSize="0.8rem"><strong>{followingList.length}</strong> Following</Typography>
            </Stack>
          </Stack>

          {isOwnProfile ? (
            <Button size="small" variant="outlined" onClick={() => navigate("/update-profile")}>Edit</Button>
          ) : isFollowing ? (
            <Button size="small" variant="outlined" onClick={() => handleUnfollow(user._id)}>Following</Button>
          ) : (
            <Button size="small" variant="contained" onClick={() => handleFollow(user._id)}>Follow</Button>
          )}
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Questions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UserQuestions userId={user._id} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Answers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UserAnswers userId={user._id} clickable />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Followers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {followersList.length > 0 ? (
              followersList.map((f) => renderUserRow(f))
            ) : (
              <Typography>No followers yet.</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Following</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {followingList.length > 0 ? (
              followingList.map((f) => renderUserRow(f))
            ) : (
              <Typography>No following yet.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default Profile;
