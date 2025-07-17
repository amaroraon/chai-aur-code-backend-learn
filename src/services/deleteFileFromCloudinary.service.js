import { ApiError } from "../utils/ApiError.js";
import { v2 as cloudinary } from "cloudinary";

const deleteFileFromCloudinary = async (publicId) => {
  // Cloudinary Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  if (!publicId) {
    console.error("❌ Public id is not found ");
    return null;
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new ApiError(
      400,
      error.message || "Failed to delete file from cloudinary"
    );
  }
};

export { deleteFileFromCloudinary };
