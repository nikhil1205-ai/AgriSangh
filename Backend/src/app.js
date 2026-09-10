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
const allowedOrigins = [
  "https://agrisanghfrontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((url) => url.trim().replace(/\/$/, "")) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like UptimeRobot, Postman, mobile apps)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      // Allow localhost in development automatically
      if (cleanOrigin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
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
