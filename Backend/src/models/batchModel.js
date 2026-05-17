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

    // Advanced batch tracking
    statusTimeline: [
      {
        stage: { type: String, enum: ["Planning Stage", "Growing Stage", "Harvest Stage", "Sold"], required: true },
        progressStatus: { type: String, enum: ["not started", "pending", "completed"], default: "not started" },
        fromDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
      },
    ],
    buyers: [
      {
        buyerName: String,
        businessName: String,
        phone: String,
        email: String,
        quantity: Number,
        message: String,
        paymentMethod: String,
        interestedAt: { type: Date, default: Date.now },
      },
    ],
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

// Initialize status timeline on creation
batchSchema.pre("save", function (next) {
  if (this.isNew && (!this.statusTimeline || this.statusTimeline.length === 0)) {
    this.statusTimeline = [
      { stage: "Planning Stage", progressStatus: "pending", fromDate: new Date(), endDate: null },
      { stage: "Growing Stage", progressStatus: "not started", fromDate: null, endDate: null },
      { stage: "Harvest Stage", progressStatus: "not started", fromDate: null, endDate: null },
      { stage: "Sold", progressStatus: "not started", fromDate: null, endDate: null },
    ];
  }
  next();
});

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;

