import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import { getConnection } from "./src/db/oracle.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Test DB connection
async function testDBConnection() {
  try {
    const conn = await getConnection();
    console.log("Connected to Oracle DB");
    await conn.close();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
}

testDBConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
