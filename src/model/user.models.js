import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      require: [true, "UserName is required"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      require: [true, "Email is required"],
    },
    password: {
      type: String,
      lowercase: true,
      require: [true, "Password is required"],
    },
    fullName: {
      type: String,
      trim: true,
      require: [true, "Name is required"],
      index: true,
    },
    avatar: {
      type: String, //Cloudinary file String
      require: true,
    },
    coverImage: {
      type: String, //Cloudinary file String
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//pre-hooks
userSchema.pre("save", async function (next) {
  //check password is changed before hasing
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//custom-methods
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//generating JWT Access tokens
userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//generating JWT Refresh tokens
userSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
