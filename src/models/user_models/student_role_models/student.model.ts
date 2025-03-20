import { Document, Schema, Types, model } from "mongoose";
import UsersModel from "../users.model";

const StudentSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
    },
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    info: {
      type: Schema.Types.ObjectId,
      ref: "Info",
      required: false,
    },
    relationship: {
      type: Schema.Types.ObjectId,
      ref: "Relationship",
      required: false,
    },
    family_status: {
      type: Schema.Types.ObjectId,
      ref: "FamilyStatus",
      required: false,
    },
    behavior_and_risk: {
      type: Schema.Types.ObjectId,
      ref: "BehaviorAndRisk",
      required: false,
    },
    sdq: {
      type: Schema.Types.ObjectId,
      ref: "SDQ",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
//12345bp@bangpaeschool.ac.th
const StudentModel = UsersModel.discriminator("Student", StudentSchema);
export default StudentModel;
