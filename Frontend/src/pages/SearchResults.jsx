import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/questions/search?query=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p>No matching questions found.</p>
      ) : (
        results.map((q) => (
          <div key={q._id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
            <Link to={`/questions/${q._id}`}>
              <h3>{q.title}</h3>
            </Link>
            <p>{q.description}</p>
            <p><strong>Asked by:</strong> {q.askedBy?.name || "Anonymous"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
