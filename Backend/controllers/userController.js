import { v2 as cloudinary } from "cloudinary";

import fs from "fs";
import { User } from "../models/userModel.js";

// Authenticated user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("followers", "name _id")
      .populate("following", "name _id");

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// PUT /user/update
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password, bio, username, avatar } = req.body;

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) return res.status(400).json({ message: "Username already taken" });
      user.username = username;
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (password) user.password = password;

    await user.save();
    res.json({ message: "Profile updated successfully", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPublicUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") // exclude sensitive data
      .populate("followers", "name username avatar _id")  
      .populate("following", "name username avatar _id"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching public profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// PUT /user/upload-avatar
export const uploadAvatar = async (req, res) => {
  console.log("📸 File received:", req.file);

  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      public_id: `user_${req.userId}`,
      overwrite: true,
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Save Cloudinary URL in DB
    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({ avatar: user.avatar });

  } catch (err) {
    console.error("❌ Avatar upload failed:", err);
    res.status(500).json({
      message: "Avatar upload failed",
      error: err.message,
    });
  }
};



// controllers/userController.js

export const followUser = async (req, res) => {
  const userId = req.userId;
  const targetId = req.params.id;

  if (userId === targetId) return res.status(400).json({ msg: "Cannot follow yourself" });

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!target || !user) return res.status(404).json({ msg: "User not found" });

  if (!user.following.includes(targetId)) {
    user.following.push(targetId);
    target.followers.push(userId);
    await user.save();
    await target.save();
  }

  res.json({ msg: "Followed" });
};

export const unfollowUser = async (req, res) => {
  const userId = req.userId;
  const targetId = req.params.id;

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!target || !user) return res.status(404).json({ msg: "User not found" });

  user.following = user.following.filter((id) => id.toString() !== targetId);
  target.followers = target.followers.filter((id) => id.toString() !== userId);

  await user.save();
  await target.save();

  res.json({ msg: "Unfollowed" });
};


export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("following");
    const followingIds = user.following.map((id) => id.toString());
    res.json({ followingIds });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};



export const getFollowStats = async (req, res) => {
  try {
    const { userIds } = req.body;
    const stats = {};
    const users = await User.find({ _id: { $in: userIds } }).select("_id followers following");

    users.forEach((u) => {
      stats[u._id] = {
        followers: u.followers.length,
        following: u.following.length,
      };
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

