import mongoose from "mongoose";
import cachegoose from "recachegoose";

export const Cache = cachegoose(mongoose, { engine: "file" });
