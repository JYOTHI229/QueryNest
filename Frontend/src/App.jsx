// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
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
import SearchResults from "./pages/SearchResults";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/users/:id" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Private Routes */}
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }/>

          <Route path="/update-profile" element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }/>

          <Route path="/ask" element={
            <PrivateRoute>
              <PostQuestion />
            </PrivateRoute>
          }/>

          <Route path="/my-questions" element={
            <PrivateRoute>
              <MyQuestions />
            </PrivateRoute>
          }/>

          <Route path="/questions/edit/:id" element={
            <PrivateRoute>
              <EditQuestion />
            </PrivateRoute>
          }/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;