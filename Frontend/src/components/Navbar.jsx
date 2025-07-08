import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  InputBase,
  Paper,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setQuery("");
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1976d2", zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          QueryNest
        </Typography>

        {/* Right section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Toggle Search Icon */}
          <Tooltip title="Search">
            <IconButton color="inherit" onClick={() => setShowSearch(!showSearch)}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Home icon */}
          {!isMobile && (
            <Tooltip title="Home">
              <IconButton color="inherit" onClick={() => navigate("/")}>
                <HomeIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Profile icon */}
          {!isMobile && user && (
            <Tooltip title="Profile">
              <IconButton color="inherit" onClick={() => navigate("/profile")}>
                {user.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 30, height: 30 }} />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
            </Tooltip>
          )}

          {/* Ask / Login / Logout Buttons on Large Screens */}
          {!isMobile &&
            (user ? (
              <>
                <Button variant="text" color="inherit" onClick={() => navigate("/ask")}>
                  Ask
                </Button>
                <Button variant="text" color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="text" color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="text" color="inherit" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            ))}

          {/* Mobile menu */}
          {isMobile && (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigate("/"); handleMenuClose(); }}>Home</MenuItem>
                {user ? (
                  <>
                    <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>Profile</MenuItem>
                    <MenuItem onClick={() => { navigate("/ask"); handleMenuClose(); }}>Ask</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => { navigate("/login"); handleMenuClose(); }}>Login</MenuItem>
                    <MenuItem onClick={() => { navigate("/register"); handleMenuClose(); }}>Register</MenuItem>
                  </>
                )}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Search bar toggle */}
      {showSearch && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Paper component="form" onSubmit={handleSearch} sx={{ display: "flex", alignItems: "center", p: "2px 8px" }}>
            <InputBase
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
