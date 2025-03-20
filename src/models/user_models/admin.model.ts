import { Document, Schema, model } from "mongoose";
import UserModel from "./users.model";
const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin_id: {
      type: String,
      required: true,
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
const AdminModel = UserModel.discriminator("Admin", AdminSchema);
export default AdminModel;
