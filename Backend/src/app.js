const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const batchRoutes = require("./routes/batchRoutes");
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

app.get("/api/health", (_req, res) =>
  res.json({
    success: true,
    message: "AgriSangh API healthy",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
