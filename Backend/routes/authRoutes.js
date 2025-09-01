import express from "express";
import {
  Register,
  Login,
  RefreshToken,
  Logout,
  ForgotPassword, 
  ResetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/refresh-token", RefreshToken);
router.post("/logout", Logout);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);


export default router;
