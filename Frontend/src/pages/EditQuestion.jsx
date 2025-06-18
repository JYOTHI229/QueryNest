import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description);
      } catch (err) {
        alert("Failed to load question");
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/questions/${id}`, { title, description });
      alert("Question updated!");
      navigate(`/questions/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update question");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Your Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Title"
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Description"
          style={{ width: "100%" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Update Question
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
