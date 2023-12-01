import mongoose from "mongoose";

const DB_CONNECTION_STRING = process.env.DB_URI;

export const connect = async () => {
  if (!DB_CONNECTION_STRING) {
    throw new Error(
      "No DB info found, please specify DB_CONNECTION_STRING into your environment variables"
    );
  }
  await mongoose.connect(DB_CONNECTION_STRING);
};
