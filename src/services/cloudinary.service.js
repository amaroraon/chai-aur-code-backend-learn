import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import crypto from "crypto";

const uploadOnCloudinary = async (localFilePath, fileName, folderName) => {
  // Cloudinary Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!localFilePath || !fs.existsSync(localFilePath)) {
    console.error("❌ Invalid localFilePath:", localFilePath);
    return null;
  }
  try {
    if (!localFilePath) return null;

    // Uploading File to Cloudinary
    const safePath = localFilePath.replace(/\\/g, "/");
    const uniqueID = crypto.randomBytes(16).toString("hex");

    const response = await cloudinary.uploader.upload(safePath, {
      public_id: fileName + uniqueID,
      resource_type: "auto",
      folder: folderName,
    });
    //image url optimization from cloudinary↗️
    // const optimizedUrl = cloudinary.url(response.public_id, {
    //   transformation: [{ quality: "auto", fetch_format: "auto" }],
    // });

    try {
      fs.unlinkSync(localFilePath); //deleting file from server after upload to cloudinary
    } catch (unlinkErr) {
      console.error("❌Error deleting temp file:", unlinkErr);
    }

    if (!response) {
      console.error("❌Failed to upload file to cloudinary ");
      return null;
    }
    return response;
  } catch (error) {
    console.error("❌ Upload failed due to:", error);
    try {
      fs.unlinkSync(localFilePath); //deleting file from server after upload to cloudinary
    } catch (unlinkErr) {
      console.error("❌Error deleting temp file:", unlinkErr);
    }
    return null;
  }
};

export { uploadOnCloudinary };
