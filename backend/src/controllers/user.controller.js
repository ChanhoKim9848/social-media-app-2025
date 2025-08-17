import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";
import cloudinary from "cloudinary";

// get user profile function
export const getUserProfile = asyncHandler(async (req, res) => {
  // find user requesting by username
  const { username } = req.params;
  const user = await User.findOne({ username });

  // if user not found
  if (!user) return res.status(404).json({ error: "User not found" });
  // once found
  res.status(200).json({ user });
});

// update user profile function
export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const updates = { ...req.body };

  // If profilePicture is uploaded
  if (req.files?.profilePicture?.[0]) {
    const uploadRes = await cloudinary.uploader.upload(
      req.files.profilePicture[0].path,
      { folder: "profile_pictures" }
    );
    updates.profilePicture = uploadRes.secure_url;
  }

  // If bannerImage is uploaded
  if (req.files?.bannerImage?.[0]) {
    const uploadRes = await cloudinary.uploader.upload(
      req.files.bannerImage[0].path,
      { folder: "banner_images" }
    );
    updates.bannerImage = uploadRes.secure_url;
  }

  const user = await User.findOneAndUpdate({ clerkId: userId }, updates, {
    new: true,
  });

  res.status(200).json({ user });
});

// sync user profile function
export const syncUser = asyncHandler(async (req, res) => {
  // clerk id
  const { userId } = getAuth(req);

  // check if user already exists in Mongo DB
  const existingUser = await User.findOne({ clerkId: userId });
  // if user exists already, no action
  if (existingUser) {
    return res
      .status(200)
      .json({ user: existingUser, message: "User already exists" });
  }

  // if user does not exist
  // create new user from clerk data
  const clerkUser = await clerkClient.users.getUser(userId);

  // the data to be saved in Mongo DB
  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    // first section of username , user is username from user@naver.com
    username: clerkUser.emailAddresses[0].emailAddress.split("@")[0] || "",
    profilePicture: clerkUser.imageUrl || "",
  };

  //   create new user data in Mongo DB
  const user = await User.create(userData);

  //   successful response
  res.status(201).json({ user, message: "User created successfully" });
});

// get current user function
export const getCurrentUser = asyncHandler(async (req, res) => {
  // user id from clerk
  const { userId } = getAuth(req);
  //   find id in mongo db
  const user = await User.findOne({ clerkId: userId });
  // if user does not exist, response user not found
  if (!user) return res.status(404).json({ error: "User not found" });
  // else, response current user
  res.status(200).json({ user });
});

// follow user function
export const followUser = asyncHandler(async (req, res) => {
  // get user id from cleck
  const { userId } = getAuth(req);
  //  get  target user to follow
  const { targetUserId } = req.params;

  //   if user and target user are same, error response
  if (userId === targetUserId)
    return res.status(400).json({ error: "You cannot follow yourself" });

  //  find current user in the db
  const currentUser = await User.findOne({ clerkId: userId });
  //  find target user in the db
  const targetUser = await User.findById(targetUserId);

  //   if current user or target user do not exist, error
  if (!currentUser || !targetUser)
    return res.status(404).json({ error: "User not found" });

  //   put following user data into the user that followed
  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  //   response user follow / unfollow
  res.status(200).json({
    message: isFollowing
      ? "User unfollowed successfully"
      : "User followed successfully",
  });
});
