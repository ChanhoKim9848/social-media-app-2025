import express from "express";
import {
    followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// public route

// route get user profile function
router.get("/profile/:username", getUserProfile);


// protected route

// route sync user function after checking login
router.post("/sync", protectRoute, syncUser);
// route current user after checking login
router.post("/me", protectRoute, getCurrentUser);
// route update profile function after checking login
// whenever user goes to profile page, they need to update profile
router.put("/profile", protectRoute, updateProfile);
// route follow user function after checking login
router.post("/follow/:targetUserId", protectRoute, followUser);


export default router;
