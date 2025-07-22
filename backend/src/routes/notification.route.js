import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotifications, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

// protected route (authenticated)
// notification route
router.get("/", protectRoute, getNotifications);
// delete notification route
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
