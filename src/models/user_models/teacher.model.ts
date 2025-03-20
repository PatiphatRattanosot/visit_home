import { Document, Schema, Types, model } from "mongoose";
import UserModel from "./users.model";

const schema = new Schema(
  {
    teacher_id: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const TeacherModel = UserModel.discriminator("Teacher", schema);
export default TeacherModel;
