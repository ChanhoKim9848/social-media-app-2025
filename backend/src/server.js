import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

// use express
const app = express();

app.use(cors());
app.use(express.json());

// clerk middleware for authentication
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Hello from server"));

// user route api
app.use("/api/users", userRoutes);
// post route api
app.use("/api/posts", postRoutes);

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
    app.listen(ENV.PORT, () =>
      console.log("Server is running on PORT:", ENV.PORT)
    );
    // error catch failing to start server
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
