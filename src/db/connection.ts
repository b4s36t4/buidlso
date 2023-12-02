import mongoose from "mongoose";

export const connect = async () => {
  const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
  if (!DB_CONNECTION_STRING) {
    throw new Error(
      "No DB info found, please specify DB_CONNECTION_STRING into your environment variables"
    );
  }
  await mongoose.connect(DB_CONNECTION_STRING);
};
