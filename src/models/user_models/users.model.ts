import { Document, Schema, model } from "mongoose";

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Student", "Teacher", "Admin"],
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);
const UserModel = model("User", schema);
export default UserModel;
