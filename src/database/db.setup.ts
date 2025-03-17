import mongoose from "mongoose";

// Connect to the MongoDB database
const mongodbURI = process.env.DB_URL;

mongoose
  .connect(mongodbURI)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log("Database connection error : " + err));
export default mongoose;
