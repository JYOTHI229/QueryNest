// src/components/Layout.jsx
import Navbar from "./Navbar";
import { Box } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Box sx={{ mt: { xs: "56px", sm: "64px" } }}>{children}</Box>
    </>
  );
};

export default Layout;
