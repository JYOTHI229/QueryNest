import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/questions/all");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err.response?.data || err.message);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h2>All Questions</h2>
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
            <h3>{q.title}</h3>
            <p>{q.description}</p>
            <p>
              <strong>Asked by:</strong> {q.askedBy?.name || "Unknown"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllQuestions;
