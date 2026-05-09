const mongoose = require("mongoose");
const Counter = require("./counterModel");

const groupSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, unique: true, index: true },
    groupName: { type: String, required: true, trim: true, index: true },

    leader: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true, index: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Farmer" }],
    joinRequests: [
      {
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
        requestedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      },
    ],

    cropFocus: { type: String, trim: true, index: true },
    cropSeason: { type: String, trim: true, index: true },
    totalOperationalLand: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed", "archived"], default: "active", index: true },

    village: { type: String, trim: true, index: true },
    district: { type: String, trim: true, index: true },
    state: { type: String, trim: true, index: true },

    activeBatch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },

    irrigationPlanning: {
      method: { type: String, trim: true },
      schedule: { type: String, trim: true },
    },

    technologyAccess: [{ type: String, trim: true }],

    analytics: {
      estimatedYield: { type: Number, default: 0 },
      totalContributedLand: { type: Number, default: 0 },
    },

    cropPlanning: {
      cropType: { type: String, trim: true },
      season: { type: String, trim: true },
      timeline: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

groupSchema.statics.generateGroupId = async function generateGroupId() {
  const seq = await Counter.next("group", { startAt: 1 });
  return `AGS-GRP-${String(seq).padStart(4, "0")}`;
};

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;

