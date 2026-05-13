const mongoose = require("mongoose");
const Counter = require("./counterModel");

const revenueSchema = new mongoose.Schema(
  {
    revenueId: {
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

    // Total revenue earned by collective group
    totalRevenue: {
      type: Number,
      required: true,
      min: 0,
    },

    // Store farmer-wise revenue share
    distribution: [
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
        amountInQuintal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Store revenue participation percentage
    // Formula: (farmer_revenue / totalRevenue) * 100
    percentage: [
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
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to auto-calculate revenue percentages
 */
revenueSchema.pre("save", function (next) {
  if (this.distribution && this.distribution.length > 0 && this.totalRevenue > 0) {
    // Auto-calculate percentages if not provided
    if (!this.percentage || this.percentage.length === 0) {
      this.percentage = this.distribution.map((entry) => ({
        farmer: entry.farmer,
        farmerId: entry.farmerId,
        percentage: Number(
          ((entry.amountInQuintal / this.totalRevenue) * 100).toFixed(2)
        ),
      }));
    }
  }
  next();
});

/**
 * Generate revenue ID
 * Format: AGS-REV-000001
 */
revenueSchema.statics.generateRevenueId = async function generateRevenueId() {
  const seq = await Counter.next("revenue", { startAt: 1 });
  return `AGS-REV-${String(seq).padStart(6, "0")}`;
};

const Revenue = mongoose.model("Revenue", revenueSchema);
module.exports = Revenue;