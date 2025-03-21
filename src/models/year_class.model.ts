import { Schema, model } from "mongoose";

const YearSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    class: [
      {
        grade: { type: Number, required: false },
        room: { type: Number, required: false },
        teacher_id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);
const YearModel = model("Year", YearSchema);
export default YearModel;
