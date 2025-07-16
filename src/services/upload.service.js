import { formatCloudinaryResponse } from "../utils/formatCloudinaryResponse.js";
import { uploadOnCloudinary } from "./cloudinary.service.js";

const uploadImage = async (fileLocalPath, fileName, folderName) => {
  const result = formatCloudinaryResponse(
    await uploadOnCloudinary(fileLocalPath, fileName, folderName)
  );
  if (!result) throw new ApiError(500, "Image upload failed");
  return result;
};

export { uploadImage };
