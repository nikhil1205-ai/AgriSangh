const mongoose = require("mongoose");
const Counter = require("./counterModel");

const revenueSchema = new mongoose.Schema(
  {
    revenueId: { type: String, required: true, unique: true, index: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },
    totalRevenue: { type: Number, required: true, min: 0 },
    distribution: [
      {
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
        farmerId: { type: String },
        amount: { type: Number, required: true, min: 0 },
        percentage: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
  },
  { timestamps: true }
);

revenueSchema.statics.generateRevenueId = async function generateRevenueId() {
  const seq = await Counter.next("revenue", { startAt: 1 });
  return `AGS-REV-${String(seq).padStart(6, "0")}`;
};

const Revenue = mongoose.model("Revenue", revenueSchema);
module.exports = Revenue;

