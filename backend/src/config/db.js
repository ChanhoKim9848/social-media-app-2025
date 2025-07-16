import mongoose from "mongoose";
import { ENV } from "./env.js";

// connect DB function
export const connectDB = async () => {
  try {
    // connect to DB with the URI of MongoDB from .env file
    await mongoose.connect(ENV.MONGO_URI);
    console.log("Connected to DB successfully");

  } catch (error) {
    // error catch
    console.log("Error connecting to MongoDB");
    process.exit(1);
  }
};
