import multer from "multer";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueName = crypto.randomBytes(16).toString("hex");
    cb(null, uniqueName + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2.5 * 1024 * 1024, // ✅ upto 2.5 MB
  },
});
