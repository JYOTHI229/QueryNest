import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";

import api from "../api";
import "../styles/Home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
    <div className="quora-home">
      {/* Top Navbar */}
      <nav className="quora-navbar">
        <div className="quora-logo" onClick={() => navigate("/")}>QueryNest</div>
        <SearchBar/>
        <div className="quora-auth-buttons">
          {user ? (
            <>
              <button className="nav-button" onClick={() => navigate("/profile")}>Profile</button>
              <button className="nav-button" onClick={handleLogout}>Logout</button>
              <button className="nav-button" onClick={() => navigate("/ask")}>ASK</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="nav-button">Login</button></Link>
              <Link to="/register"><button className="nav-button">Register</button></Link>
            </>
          )}
        </div>
      </nav>

      {/* Question Feed */}
      <main className="quora-feed">
        <h2 className="feed-heading">Top Questions</h2>
        {questions.length === 0 ? (
          <p>No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((q) => (
            <div key={q._id} className="question-box">
              {/* Wrap title in Link */}
              <Link to={`/questions/${q._id}`} className="question-link">
                <h3>{q.title}</h3>
              </Link>
              <p>{q.description}</p>
              <p className="author-name">
                <strong>Asked by:</strong> {q.askedBy?.name || "Anonymous"}
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
