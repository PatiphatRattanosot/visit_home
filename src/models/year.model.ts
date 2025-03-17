import { Schema, model } from "mongoose";

const YearSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    classId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);
const YearModel = model("Year", YearSchema);
export default YearModel;
