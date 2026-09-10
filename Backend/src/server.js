require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

// Start listening immediately so Render detects the open port
app.listen(PORT, () => {
  console.log(`AgriSangh backend running on http://localhost:${PORT}`);
});

// Attempt database connection without blocking server start
connectDB().then(() => {
  console.log("MongoDB connected successfully");
}).catch((err) => {
  console.error("MongoDB connection failed on startup:", err.message);
  console.error("Please verify your MONGODB_URI in Render environment variables.");
});
