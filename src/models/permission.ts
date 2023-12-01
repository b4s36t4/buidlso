import { Model, Schema, model } from "mongoose";

const PermissionSchema = new Schema(
  {
    resource: String,
    value: Number,
    name: String,
  },
  { timestamps: true }
);

export const Permission = model("Permission", PermissionSchema);
