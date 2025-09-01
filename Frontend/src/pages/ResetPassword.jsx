import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res.data.message || "Password reset successfully!");
    } catch (err) {
      console.error("ResetPassword error:", err.response || err);
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        Reset Password
      </Typography>

      {message ? (
        <>
          <Typography sx={{ mt: 2, mb: 2 }} color="primary" textAlign="center">
            {message}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
          {error && (
            <Typography sx={{ mt: 2 }} color="error" textAlign="center">
              {error}
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ResetPassword;
