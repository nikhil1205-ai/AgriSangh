const mongoose = require("mongoose");
const Counter = require("./counterModel");

const contributionSchema = new mongoose.Schema(
  {
    contributionId: { type: String, required: true, unique: true, index: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true, index: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },

    landContribution: { type: Number, required: true },
    estimatedYield: { type: Number, default: 0 },
    participationPercentage: { type: Number, required: true, min: 0, max: 100 },

    season: { type: String, trim: true },
  },
  { timestamps: true }
);

contributionSchema.statics.generateContributionId = async function generateContributionId() {
  const seq = await Counter.next("contribution", { startAt: 1 });
  return `AGS-CNT-${String(seq).padStart(6, "0")}`;
};

const Contribution = mongoose.model("Contribution", contributionSchema);
module.exports = Contribution;

