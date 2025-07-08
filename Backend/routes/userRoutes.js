import express from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  followUser,
  unfollowUser,
  getPublicUserProfile,
  getFollowing,
  getFollowStats
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.get("/public/:id", getPublicUserProfile);
router.put("/update", verifyToken, updateProfile);
router.put("/upload-avatar", verifyToken, upload.single("avatar"), uploadAvatar);
router.put("/follow/:id", verifyToken, followUser);
router.get("/following", verifyToken ,getFollowing);
router.put("/unfollow/:id", verifyToken, unfollowUser);
router.post("/follow-stats", verifyToken , getFollowStats);

export default router;
