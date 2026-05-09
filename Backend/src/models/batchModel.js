const mongoose = require("mongoose");
const Counter = require("./counterModel");

const batchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true, index: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },

    cropType: { type: String, required: true, trim: true, index: true },
    season: { type: String, trim: true, index: true },
    estimatedProduction: { type: Number, default: 0 },
    status: { type: String, enum: ["planned", "active", "harvested", "sold"], default: "planned" },
    farmersInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Farmer" }],
  },
  { timestamps: true }
);

function cropToken(cropType) {
  return String(cropType || "CROP")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 12);
}

batchSchema.statics.generateBatchId = async function generateBatchId({ cropType, year }) {
  const token = cropToken(cropType);
  const y = year || new Date().getFullYear();
  const key = `batch:${token}:${y}`;
  const seq = await Counter.next(key, { startAt: 1 });
  return `AGS-${token}-${y}-${String(seq).padStart(3, "0")}`;
};

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;

