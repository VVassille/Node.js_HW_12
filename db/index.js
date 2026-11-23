import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

const connectDB = async () => {
  await client.connect();

  db = client.db(process.env.DB_NAME);

  console.log("MongoDB connected successfully");

  return db;
};

const getDB = () => {
  if (!db) {
    throw new Error("Database is not connected");
  }

  return db;
};

export { connectDB, getDB };
