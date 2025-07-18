
// cloudinary is a tool to upload image file and store image in the cloudinary cloud

// import v2 as cloudinary
import { v2 as cloudinary } from "cloudinary";
// get environment variables
import { ENV } from "./env.js";

// pass cloudinary config
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;
