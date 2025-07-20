import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// get notifications function
export const getNotifications = asyncHandler(async (req, res) => {
  // request currently authenticated user id
  const { userId } = getAuth(req);

  //   get current user with user id
  const user = await User.findOne({ clerkId: userId });
  //   error
  if (!user) return res.status(404).json({ error: "User not found" });

  //   notification ui
  //   from what post and comment itself
  const notifications = await Notification.find({ to: user._id })
    .sort({ createdAt: -1 })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content");

  // response notifications
  res.status(200).json({ notifications });
});

// delete notification function
export const deleteNotification = asyncHandler(async (req, res) => {
  // get user id from currently logged in user
  const { userId } = getAuth(req);
  //   get notification id
  const { notificationId } = req.params;

  //   find user with the user id
  const user = await User.findOne({ clerkId: userId });
  //   error
  if (!user) return res.status(404).json({ error: "User not found" });

  //   delete notification from ui and db
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    to: user._id,
  });

  //   if notification does not exist, error
  if (!notification)
    return res.status(404).json({ error: "Notification not found" });

  //   response successful
  res.status(200).json({ message: "Notification deleted successfully" });
});
