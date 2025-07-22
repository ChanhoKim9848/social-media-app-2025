import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// get comments function
export const getComments = asyncHandler(async (req, res) => {
  // request post id
  const { postId } = req.params;

  //   find comment with post id
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    // profile picture, lastName, firstName, user order on comment
    .populate("user", "username firstName lastName profilePicture");

  // response comments data
  res.status(200).json({ comments });
});

// create comment function
export const createComment = asyncHandler(async (req, res) => {
  // get user id from the authentication
  const { userId } = getAuth(req);
  //   post id of the comment
  const { postId } = req.params;
  //   get content (comment)
  const { content } = req.body;

  //   if content is empty string, return error
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content is required" });
  }

  //   find user with user id and post with post id from the database
  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  //   if user or post is not found, error
  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

  //   create comment in the database
  const comment = await Comment.create({
    user: user._id,
    post: postId,
    content,
  });

  // link the comment to the post as it has its own comments
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  // create notification if not commenting on own post
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  //   response comment
  res.status(201).json({ comment });
});

// delete comment function
export const deleteComment = asyncHandler(async (req, res) => {
  // get user id and comment id
  const { userId } = getAuth(req);
  const { commentId } = req.params;

  //   find user id and comment from the database
  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  //   if one of them is not found, error
  if (!user || !comment) {
    return res.status(404).json({ error: "User or comment not found" });
  }

  //   if current user is not same as the comment owner that is going to be delete, error
  if (comment.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You can only delete your own comments" });
  }

  // remove comment from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
  });

  // delete the comment
  await Comment.findByIdAndDelete(commentId);

  //   response successful
  res.status(200).json({ message: "Comment deleted successfully" });
});
