import mongoose from "mongoose";
import { config } from "./app.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to MongoDB database");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB database");
    process.exit(1);
  }
};

export default connectDatabase;
