import { Schema, model, Document } from "mongoose";

const ClassSchema = new Schema(
  {
    grade: { type: Number, required: true },
    room: { type: Number, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  },
  { timestamps: true }
);

const ClassModel = model("Class", ClassSchema);
export default ClassModel;
