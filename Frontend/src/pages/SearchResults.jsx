import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

// Highlight matched keyword in result text
const highlightText = (text, keyword) => {
  if (!keyword) return text;
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "#ffeeba" }}>{part}</span>
    ) : (
      part
    )
  );
};

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.trim();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    document.title = `Search: ${query}`;

    const fetchResults = async () => {
      try {
        const res = await api.get(`/questions/search?query=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchResults();
  }, [query]);

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: { xs: 2, sm: 4 },
        mb: { xs: 4, sm: 6 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: {
            xs: "1.2rem",
            sm: "1.5rem",
            md: "1.8rem",
          },
          fontWeight: 600,
        }}
      >
        Search Results for "{query}"
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : results.length === 0 ? (
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            mt: 2,
          }}
        >
          No matching questions found.
        </Typography>
      ) : (
        results.map((q) => {
          const shortDescription =
            q.description.length > 150
              ? q.description.slice(0, 150) + "..."
              : q.description;

          return (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  mt: 3,
                  px: { xs: 2, sm: 3 },
                  py: 2,
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ px: 0 }}>
                  <Link
                    to={`/questions/${q._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontSize: {
                          xs: "1rem",
                          sm: "1.2rem",
                          md: "1.3rem",
                        },
                        fontWeight: 500,
                      }}
                    >
                      {highlightText(q.title, query)}
                    </Typography>
                  </Link>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      color: "text.primary",
                    }}
                  >
                    {highlightText(shortDescription, query)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 2,
                      display: "block",
                      fontSize: { xs: "0.75rem", sm: "0.85rem" },
                    }}
                  >
                    Asked by: {q.askedBy?.name || "Anonymous"} |{" "}
                    {new Date(q.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          );
        })
      )}
    </Container>
  );
};

export default SearchResults;
