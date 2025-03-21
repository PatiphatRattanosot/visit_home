import { Document, Schema, Types, model } from "mongoose";
import UserModel from "./users.model";

const schema = new Schema(
  {
    user_id: {
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
      default: "รับราชการ", //รับราชการ, ลาออก,เกษียณ,ย้ายโรงเรียน
    },
  },
  {
    timestamps: true,
  }
);
//bp123@bangpaeschool.ac.th
const TeacherModel = UserModel.discriminator("Teacher", schema);
export default TeacherModel;
