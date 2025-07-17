import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFileFromCloudinary } from "../services/deleteFileFromCloudinary.service.js";
import { uploadImage } from "../services/upload.service.js";

//update user email & password
const updatedUserPassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);

  const isOldPasswordCorrect = await user.validatePassword(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "User old password is incorrect");
  }
  user.password = newPassword; //updating older password with new one🌟

  const updatedUser = await user.save().select("-password");

  if (!updatedUser) {
    throw new ApiError(400, "Failed to update user password ");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User password updated successfully")
    );
});

//Update user avatar image
const updateUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const newAvatarLocalPath = req.file?.path;

  if (!newAvatarLocalPath) {
    throw new ApiError(400, "User avatar file is not found");
  }

  const avatarObj = await uploadImage(newAvatarLocalPath, "avatar", "avatars");

  if (!avatarObj) {
    throw new ApiError(500, "Failed to update avatar image");
  }
  //fetching previews user profile to delete from cloudinary☁️
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //fetching old avatar image public id before replacing with new one⚠️
  const oldAvatarPublicId = user.avatar?.public_id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { avatar: avatarObj },
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update user avatar");
  }
  //deleting older avatar file ✅
  if (oldAvatarPublicId) {
    await deleteFileFromCloudinary(oldAvatarPublicId);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User Avatar Updated Successfully")
    );
});
//Update user avatar image
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const newCoverImageLocalPath = req.file?.path;

  if (!newCoverImageLocalPath) {
    throw new ApiError(400, "User cover image file is not found");
  }

  const coverImageObj = await uploadImage(
    newCoverImageLocalPath,
    "coverImage",
    "coverImages"
  );

  if (!coverImageObj) {
    throw new ApiError(500, "Failed to update cover image");
  }
  //fetching previews user profile to delete from cloudinary☁️
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //fetching old cover image public id before replacing with new one⚠️
  const oldCoverImagePublicId = user.coverImage.public_id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { coverImage: coverImageObj },
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update user cover image");
  }
  //deleting older avatar file ✅

  if (oldCoverImagePublicId) {
    await deleteFileFromCloudinary(oldCoverImagePublicId);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User Cover Image Updated Successfully")
    );
});

export { updatedUserPassword, updateUserAvatar, updateUserCoverImage };
