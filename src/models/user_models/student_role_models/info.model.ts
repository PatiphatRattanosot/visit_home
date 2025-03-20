import { Document, Schema, Types, model } from "mongoose";
import UsersModel from "../users.model";

const InfoSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  father_name: {
    type: String,
    required: true,
  },
  mother_name: {
    type: String,
    required: true,
  },
  father_phone: {
    type: String,
    required: true,
  },
  mother_phone: {
    type: String,
    required: true,
  },
  father_job: {
    type: String,
    required: true,
  },
  mother_job: {
    type: String,
    required: true,
  },
});
const InfoModel = model("Info", InfoSchema);
export default InfoModel;
