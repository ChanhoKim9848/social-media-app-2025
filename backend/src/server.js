import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

// use express
const app = express();

app.use(cors());
app.use(express.json());

// clerk middleware for authentication
app.use(clerkMiddleware());
// arcjet middleware for security
app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Hello from server"));

// user route
app.use("/api/users", userRoutes);
// post route
app.use("/api/posts", postRoutes);
// comment route
app.use("api/comments", commentRoutes);
// notification route
app.use("api/notifications", notificationRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.log("Unhandled error: ", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// start server function
const startServer = async () => {
  try {
    // call DB connect function
    await connectDB();

    // listen for local development not in the production
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () =>
        console.log("Server is running on PORT:", ENV.PORT)
      );
    }
    // error catch failing to start server
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();

// export for vercel
export default app;
