import { Schema, Types, model } from "mongoose";

const PermissionSchema = new Schema(
  {
    resource: String,
    value: Number,
    name: { type: String, enum: ["read", "edit", "delete", "admin", "manage"] },
    createdBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Permission = model("Permission", PermissionSchema);
