import mongoose from "mongoose";

const mongoose_url = process.env.MONGO_URI;

if (!mongoose_url) {
  throw new Error("MONGO_URI is not defined");
}

mongoose
  .connect(mongoose_url)
  .then(() => {
    console.log("mongoose connected successfully");
  })
  .catch((err) => {
    console.log("mongoose connection error", err);
  });
