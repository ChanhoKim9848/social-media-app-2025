import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import { getAuth } from "@clerk/express"; 

// Get all posts
export const getPosts = asyncHandler(async (req, res) => {
  console.log("[getPosts] Fetching all posts...");
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username firstName lastName profilePicture" },
      });

    console.log(`[getPosts] Found ${posts.length} posts`);
    res.status(200).json({ posts });
  } catch (error) {
    console.error("[getPosts] Error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get single post by ID
export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  console.log(`[getPost] Fetching post with ID: ${postId}`);

  try {
    const post = await Post.findById(postId)
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username firstName lastName profilePicture" },
      });

    if (!post) {
      console.warn(`[getPost] Post not found with ID: ${postId}`);
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error(`[getPost] Error fetching post ${postId}:`, error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Get posts by username
export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  console.log(`[getUserPosts] Fetching posts for username: ${username}`);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.warn(`[getUserPosts] User not found: ${username}`);
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username firstName lastName profilePicture" },
      });

    console.log(`[getUserPosts] Found ${posts.length} posts for user ${username}`);
    res.status(200).json({ posts });
  } catch (error) {
    console.error(`[getUserPosts] Error fetching posts for ${username}:`, error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

// Create new post
export const createPost = asyncHandler(async (req, res) => {
  console.log("[createPost] Create post request received");

  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  console.log(`[createPost] User ID: ${userId}, Content length: ${content?.length || 0}, Image file: ${imageFile ? imageFile.originalname : "none"}`);

  if (!content && !imageFile) {
    console.warn("[createPost] Missing content and image");
    return res.status(400).json({ error: "Post must contain either text or image" });
  }

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      console.warn("[createPost] User not found");
      return res.status(404).json({ error: "User not found" });
    }

    let imageUrl = "";
    if (imageFile) {
      try {
        const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          folder: "social_media_posts",
          resource_type: "image",
          transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
        });
        imageUrl = uploadResponse.secure_url;
        console.log("[createPost] Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("[createPost] Cloudinary upload failed:", uploadError);
        return res.status(400).json({ error: "Failed to upload image" });
      }
    }

    const post = await Post.create({
      user: user._id,
      content: content || "",
      image: imageUrl,
    });

    console.log("[createPost] Post created with ID:", post._id);
    res.status(201).json({ post });
  } catch (error) {
    console.error("[createPost] Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Like or unlike post
export const likePost = asyncHandler(async (req, res) => {
  console.log("[likePost] Like/unlike post request");

  const { userId } = getAuth(req);
  const { postId } = req.params;

  try {
    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      console.warn("[likePost] User or post not found");
      return res.status(404).json({ error: "User or post not found" });
    }

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
      console.log(`[likePost] User ${user._id} unliked post ${postId}`);
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } });
      console.log(`[likePost] User ${user._id} liked post ${postId}`);

      if (post.user.toString() !== user._id.toString()) {
        await Notification.create({ from: user._id, to: post.user, type: "like", post: postId });
        console.log("[likePost] Notification created for like");
      }
    }

    res.status(200).json({ message: isLiked ? "Post unliked successfully" : "Post liked successfully" });
  } catch (error) {
    console.error("[likePost] Error liking/unliking post:", error);
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
});

// Delete post
export const deletePost = asyncHandler(async (req, res) => {
  console.log("[deletePost] Delete post request");

  const { userId } = getAuth(req);
  const { postId } = req.params;

  try {
    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      console.warn("[deletePost] User or post not found");
      return res.status(404).json({ error: "User or post not found" });
    }

    if (post.user.toString() !== user._id.toString()) {
      console.warn("[deletePost] User tried to delete post they don't own");
      return res.status(403).json({ error: "You can only delete your own posts" });
    }

    await Comment.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);

    console.log(`[deletePost] Post ${postId} deleted successfully`);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("[deletePost] Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});
