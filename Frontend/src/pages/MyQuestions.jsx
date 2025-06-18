import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchMyQuestions = async () => {
      try {
        const res = await api.get("/questions/my");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching your questions:", err.response?.data || err.message);
      }
    };
    fetchMyQuestions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Questions</h2>
      {questions.length === 0 ? (
        <p>You haven't posted any questions yet.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
            <Link to={`/questions/${q._id}`}>
              <h3>{q.title}</h3>
            </Link>
            <p>{q.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyQuestions;
