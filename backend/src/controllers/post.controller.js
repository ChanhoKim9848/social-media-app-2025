import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

// get posts function
export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    //   user profile image , first name, last name , username order is reversed
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  // response posts
  res.status(200).json({ posts });
});

// get a single post function
export const getPost = asyncHandler(async (req, res) => {
  // request post id
  const { postId } = req.params;

  // find post by id
  const post = await Post.findById(postId)
    //  post display profile Picture, lastName, firstName and username order
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  // if the post is not found
  if (!post) return res.status(404).json({ error: "Post not found" });

  //   response post
  res.status(200).json({ post });
});

// get posts function depending on username
export const getUserPosts = asyncHandler(async (req, res) => {
  // request username
  const { username } = req.params;
  // find username from the db
  const user = await User.findOne({ username });
  // if user not found,
  if (!user) return res.status(404).json({ error: "User not found" });

  //  find user with username
  const posts = await Post.find({ user: user._id })
    //  post display profile Picture, lastName, firstName and username order
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts });
});

// create post function
export const createPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  if (!content && !imageFile) {
    return res
      .status(400)
      .json({ error: "Post must contain either text or image" });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  let imageUrl = "";

  // upload image to Cloudinary if provided
  if (imageFile) {
    try {
      // convert buffer to base64 for cloudinary
      const base64Image = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;

      //   upload image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        // description
        folder: "social_media_posts",

        resource_type: "image",
        transformation: [
          // width and height limit
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });

      imageUrl = uploadResponse.secure_url;
      //   error handler
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(400).json({ error: "Failed to upload image" });
    }
  }

  //   create post
  const post = await Post.create({
    user: user._id,
    content: content || "",
    image: imageUrl,
  });

  //   response post
  res.status(201).json({ post });
});

// like post function
export const likePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  //   find user with clerk id
  const user = await User.findOne({ clerkId: userId });
  //   find post with post id
  const post = await Post.findById(postId);

  //   user or post not found, error
  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

//   boolean if user already likes the post
  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    // unlike
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    });
  } else {
    // like
    await Post.findByIdAndUpdate(postId, {
      $push: { likes: user._id },
    });

    // create notification only if user likes other user's post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
  }

//   response like / unlike
  res.status(200).json({
    message: isLiked ? "Post unliked successfully" : "Post liked successfully",
  });
});

// delete post function
export const deletePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

//   fetch user and user's post by user id and post id
  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

//   user or post not found, error
  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

//   if user tries to delete the post that does now own, error
  if (post.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You can only delete your own posts" });
  }

  // delete all comments on this post
  await Comment.deleteMany({ post: postId });

  // delete the post
  await Post.findByIdAndDelete(postId);

//   response successful
  res.status(200).json({ message: "Post deleted successfully" });
});
