// src/pages/UpdateProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  CircularProgress,
  Paper,
  Stack
} from "@mui/material";
import api from "../api";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    bio: "",
    avatar: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        const { name, username, email, bio, avatar } = res.data;
        setFormData({ name, username, email, bio, password: "", avatar });
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = formData.avatar;

      // Upload avatar if file selected
      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append("avatar", avatarFile);
        const uploadRes = await api.put("/user/upload-avatar", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        avatarUrl = uploadRes.data.avatar;
      }

      await api.put("/user/update", {
        ...formData,
        avatar: avatarUrl
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Update Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={formData.avatar || "https://i.ibb.co/2d8L5F0/default-avatar.png"}
                sx={{ width: 64, height: 64 }}
              />
              <Button variant="outlined" component="label">
                Change Avatar
                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
              </Button>
            </Box>

            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Username"
              name="username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Bio"
              name="bio"
              fullWidth
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleChange}
            />
            <TextField
              label="New Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update Profile"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateProfile;
