import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.models.js";
import { uploadImage } from "../services/upload.service.js";

//method to generate access token and refresh token's🔑
const generateUserAccessTokenAndRefreshToken = async (userID) => {
  try {
    if (!userID) {
      throw new ApiError(402, "User Id not found");
    }
    const user = await User.findById(userID);
    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating  accessToken"
    );
  }
};

//new user register method🔑
const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (
    [userName, fullName, email, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(402, "All credential is required");
  }
  const userExits = await User.findOne({ email });

  if (userExits) {
    throw new ApiError(409, "User with username or email Already exits");
  }

  //🔐checking avatar and coverImage
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  //uploading image to cloudinary
  const avatarObj = await uploadImage(avatarLocalPath, "avatar", "avatars");
  const coverImageObj = await uploadImage(
    coverImageLocalPath,
    "coverImage",
    "coverImages"
  );

  //checking response from cloudinary
  if (!avatarObj) {
    return new ApiError(400, "Failed to upload avatar image ");
  }

  let userCoverImage;
  if (coverImageObj) {
    userCoverImage = coverImageObj;
  }

  const user = await User.create({
    userName,
    fullName,
    email,
    password,
    avatar: avatarObj,
    coverImage: userCoverImage ? userCoverImage : "",
  });

  const userData = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userData) {
    throw new ApiError(500, "Internal server error while creating new user!!!");
  }

  //returning user response to frontend⭐
  return res
    .status(201)
    .json(new ApiResponse(200, userData, "User created successfully!"));
});

//user login method🔐
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //checking email & password is available or not
  if (!(email && password)) {
    throw new ApiError(402, "Email and Password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(402, "Invalid User");
  }

  const validatePassword = await user.validatePassword(password);

  if (!validatePassword) {
    throw new ApiError(401, "Invalid password");
  }
  //generated user's access token & refresh token🔑
  const { accessToken, refreshToken } =
    await generateUserAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //cookie config option
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//user logout method🔓
const logoutUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(
      userId,
      {
        $set: { refreshToken: undefined },
      },
      {
        new: true,
      }
    );
    //cookie config option
    const option = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, {}, "User logout success"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "something went wrong while logout user"
    );
  }
});

//get User🧑
const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(400, "Failed to get user");
  }
  res.status(200).json(new ApiResponse(200, user, "Success to get user"));
});

export { registerUser, loginUser, logoutUser, getUser };
