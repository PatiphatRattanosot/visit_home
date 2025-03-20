import { Document, Schema, model } from "mongoose";

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
    role: [
      {
        type: String,
        required: true,
        enum: ["Admin", "Teacher", "Student"],
        default: "Student",
      },
    ],
    tpye: {
      type: String,
      required: true,
      enum: ["Teacher", "Student"],
    },
  },
  {
    timestamps: true,
    discriminatorKey: "tpye",
  }
);
const UserModel = model("User", schema);
export default UserModel;
