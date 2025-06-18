import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; 
import UpdateProfile from "./pages/UpdateProfile";
import PostQuestion from "./pages/PostQuestion";
import PrivateRoute from "./components/PrivateRoute";
import QuestionDetails from "./pages/QuestionDetails";
import MyQuestions from "./pages/MyQuestions";
import EditQuestion from "./pages/EditQuestion";
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


        <Route path="/questions/:id" element={<QuestionDetails />} />

        <Route path="/my-questions" element={<MyQuestions />} />

        <Route path="/questions/edit/:id" element={<EditQuestion />} />



        
      </Routes>
    </Router>
  );
}

export default App;
