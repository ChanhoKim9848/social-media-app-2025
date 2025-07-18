import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  likePost,
} from "../controllers/post.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

// route posts
router.get("/", getPosts);
//route post depending on post id
router.get("/:postId", getPost);
// route user post depending on username
router.get("/user/:username", getUserPosts);

// protected (authenticated) routes

// route upload image and create post
router.post("/", protectRoute, upload.single("image"), createPost);
// route like function
router.post("/:postId/like", protectRoute, likePost);
// route delete function
router.delete("/:postId/like", protectRoute, deletePost);

export default router;
