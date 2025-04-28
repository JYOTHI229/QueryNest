import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to QueryNest</h1>
      <p>Your place to ask and answer amazing questions!</p>

      {/* If user is logged in */}
      {user ? (
        <div>
          <h2>Hello, {user.name} 👋</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        // If user is not logged in
        <div style={{ marginTop: "1rem" }}>
          <Link to="/register">
            <button style={{ marginRight: "1rem" }}>Register</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
