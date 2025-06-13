import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; 
import UpdateProfile from "./pages/UpdateProfile";
import PostQuestion from "./pages/PostQuestion";
import AllQuestions from "./pages/AllQuestions";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/update-profile"
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }
        />
        
        <Route path="/ask" element={<PrivateRoute><PostQuestion /></PrivateRoute>} />
        <Route path="/questions" element={<PrivateRoute><AllQuestions /></PrivateRoute>} />

        
      </Routes>
    </Router>
  );
}

export default App;
