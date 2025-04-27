import axios from "../axios";

const Home = () => {
  const handleLogout = async () => {
    await axios.post('/auth/logout');
    alert('Logged out!');
  };

  const refreshAccessToken = async () => {
    await axios.post('/auth/refresh-token');
    alert('Access token refreshed!');
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={refreshAccessToken}>Refresh Access Token</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
