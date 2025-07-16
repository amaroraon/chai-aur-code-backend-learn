import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

//configuring .env files
dotenv.config({ path: "./.env" });

//connection to database
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `🌿 Server running on address: http://localhost:${process.env.PORT}`
      );
    });

    //listing to error while connecting app❌
    app.on("error", (error) => {
      throw new Error("ERR", error);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection FAILED !!!", error);
  });
