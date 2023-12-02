import { Model, Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    email: String,
    password: { type: String, select: false },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
