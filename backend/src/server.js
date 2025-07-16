import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

// use express
const app = express();

// call DB connect function
connectDB();

app.get("/", (req, res) => res.send("Hello from server"));

app.listen(ENV.PORT, () => console.log("Server is running on PORT:", ENV.PORT));
