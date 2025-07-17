import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js"

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

// use express
const app = express();

app.use(cors());
app.use(express.json());

// clerk middleware for authentication
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Hello from server"));

app.use("/api/users", userRoutes);

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
