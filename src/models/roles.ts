import mongoose, { model } from "mongoose";

const RoleSchema = new mongoose.Schema({
  title: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  state: {
    type: String,
    enum: ["DELETED", "CREATED"],
  },
});

export const Role = model("Role", RoleSchema);
