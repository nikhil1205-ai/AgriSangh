const mongoose = require("mongoose");
const Counter = require("./counterModel");

const contributionSchema = new mongoose.Schema(
  {
    contributionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },

    // Total combined land of all farmers in group
    totalLand: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Store all farmer contributions inside the group
    landContribution: [
      {
        farmer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Farmer",
          required: true,
        },
        farmerId: {
          type: String,
          required: true,
        },
        landSize: {
          type: Number,
          required: true,
          min: 0,
        },
        // Formula: (farmer_land / total_land) * 100
        participationPercentage: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
      },
    ],

    // Season for which this contribution applies
    season: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to auto-calculate totalLand and participation percentages
 */
contributionSchema.pre("save", function (next) {
  if (this.landContribution && this.landContribution.length > 0) {
    // Calculate total land
    const totalLand = this.landContribution.reduce((total, contrib) => {
      return total + Number(contrib.landSize || 0);
    }, 0);

    this.totalLand = totalLand;

    // Auto-calculate participation percentages for each farmer
    if (totalLand > 0) {
      this.landContribution = this.landContribution.map((contrib) => ({
        ...contrib,
        participationPercentage: Number(
          ((contrib.landSize / totalLand) * 100).toFixed(2)
        ),
      }));
    }
  }
  next();
});

/**
 * Generate contribution ID
 * Format: AGS-CNT-000001
 */
contributionSchema.statics.generateContributionId = async function generateContributionId() {
  const seq = await Counter.next("contribution", { startAt: 1 });
  return `AGS-CNT-${String(seq).padStart(6, "0")}`;
};

const Contribution = mongoose.model("Contribution", contributionSchema);
module.exports = Contribution;