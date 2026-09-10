const mongoose = require("mongoose");
const dns = require("dns");

// Fix for Node 18+ / Node 24 DNS SRV resolution issues on Render & cloud environments
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

let isConnected = false;

async function connectDB() {
  if (isConnected) return mongoose.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing env var MONGODB_URI");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  return mongoose.connection;
}

module.exports = { connectDB };

