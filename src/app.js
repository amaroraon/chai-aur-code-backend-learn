import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "15kb" }));
app.use(express.json({ limit: "15kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import Routes
import userRoute from "./routes/user.router.js";

//Route's
app.use("/api/v1/user", userRoute);
// route struct : /api/v1/user/register
export { app };
