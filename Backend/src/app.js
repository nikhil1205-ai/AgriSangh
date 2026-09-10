const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { notFound, errorHandler } = require("./utils/errors");

const authRoutes = require("./routes/authRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const groupRoutes = require("./routes/groupRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const batchRoutes = require("./routes/batchRoutes");
const revenueRoutes = require("./routes/revenueRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const mongoose = require("mongoose");

app.get("/api/health", (_req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  const healthInfo = {
    status: isDbConnected ? "UP" : "DOWN",
    success: isDbConnected,
    message: isDbConnected ? "Backend API is fully operational" : "Database connection issue",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: isDbConnected ? "connected" : "disconnected",
  };

  return res.status(isDbConnected ? 200 : 503).json(healthInfo);
});

// Alias for /ping endpoint often used by UptimeRobot
app.get("/ping", (_req, res) => res.status(200).send("PONG"));

app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
