import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // still loading
  if (user === undefined) return <div>Loading...</div>;

  // not logged in
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
