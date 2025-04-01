import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_CLOUD_NAME = Bun.env.CLOUDINARY_CLOUD_NAME 
const CLOUDINARY_API_KEY = Bun.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = Bun.env.CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export default cloudinary;