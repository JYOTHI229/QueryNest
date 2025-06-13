import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/UpdateProfile.css"; // Add this line

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setFormData({ name: res.data.name, email: res.data.email, password: "" });
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/update", formData);
      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="update-profile-container">
      <h2 className="update-profile-heading">Update Profile</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
