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

    // Total operational/group expense (transport, irrigation, labor, storage, etc.)
    expense: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Store farmer-wise revenue share
    distribution: [
      {
        farmer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Farmer",
        },
        farmerId: {
          type: String,
          required: true,
        },
        // Revenue amount in rupees
        amountInRupee: {
          type: Number,
          default: 0,
          min: 0,
        },
        // Revenue amount in quintals (for produce)
        amountInQuintal: {
          type: Number,
          default: 0,
          min: 0,
        },
        // Auto-calculated percentage
        percentage: {
          type: Number,
          default: 0,
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
 * Formula: (farmer amountInRupee / totalRevenue) * 100
 */
revenueSchema.pre("save", function (next) {
  if (this.distribution && this.distribution.length > 0 && this.totalRevenue > 0) {
    // Auto-calculate percentages for each farmer
    this.distribution = this.distribution.map((entry) => {
      const amountInRupee = Number(entry.amountInRupee || 0);
      const percentage = (amountInRupee / this.totalRevenue) * 100;

      return {
        ...entry,
        percentage: Number(percentage.toFixed(2)),
      };
    });
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