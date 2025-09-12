import { connectDB } from "../utils/database.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    await connectDB();

    const dbState = mongoose.connection.readyState;
    const dbName = mongoose.connection.db?.databaseName;

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
      connectionState: dbState,
      database: dbName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
