import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize, testConnection, useMockDB } from "./config/database.js";
import { mockUsers, mockAnimals } from "./mockData.js";

import animalRoutes from "./routes/animalRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import redis from "./config/redis.js";

// Import all models to ensure they are registered with Sequelize
import "./models/index.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// CORS configuration for cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/contracts", contractRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection with a simple query
    const result = await sequelize.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      database: "connected",
      redis: "disconnected",
    });
  } catch (error) {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      database: "disconnected",
      databaseError: error.message,
    });
  }
});

// Database migration endpoint
app.post("/api/migrate", async (req, res) => {
  if (process.env.NODE_ENV === "production" && !req.body.force) {
    return res
      .status(403)
      .json({ message: "Not available in production without force parameter" });
  }

  try {
    // Synchronize all models with the database
    await sequelize.sync({ force: req.body.force || false });
    res.status(200).json({ message: "Database migrated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error migrating database", error: error.message });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Database schema is managed via migrations (src/migrations/runMigrations.js)
    // No auto-sync needed - tables are already created correctly
    console.log("✓ Using migration-managed schema");

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `✓ Server running on port ${PORT} (${
          useMockDB ? "MOCK DATA MODE" : "LIVE DATABASE"
        })`
      );
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export app for testing
export default app;
