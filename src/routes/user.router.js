import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controller/user.controller.js";

import {
  updatedUserPassword,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controller/updatedUserInfo.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
  "/register",

  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.post("/login", loginUser);

//secured routes
router.post("/logout", verifyJwt, logoutUser);

//update user information
router.post("/update/password", verifyJwt, updatedUserPassword);

router.post(
  "/update/Avatar",
  upload.single("avatar"),
  verifyJwt,
  updateUserAvatar
);
router.post(
  "/update/coverImage",
  upload.single("coverImage"),
  verifyJwt,
  updateUserCoverImage
);

export default router;
