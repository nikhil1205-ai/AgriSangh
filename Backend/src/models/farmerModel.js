const mongoose = require("mongoose");
const Counter = require("./counterModel");

const farmerSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    farmerId: { type: String, required: true, unique: true, index: true },

    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true },

    state: { type: String, trim: true },
    district: { type: String, trim: true },
    village: { type: String, trim: true },

    landSize: { type: Number, default: 0 },
    cropInterest: { type: String, trim: true },

    role: { type: String, enum: ["farmer", "leader"], default: "farmer", index: true },

    activeGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    groupHistory: [
      {
        group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
        groupId: { type: String },
        groupName: { type: String },
        status: { type: String, enum: ["active", "left"], default: "active" },
        joinedAt: { type: Date, default: Date.now },
        leftAt: { type: Date },
      },
    ],
    contributionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contribution" }],
  },
  { timestamps: true }
);

farmerSchema.statics.generateFarmerId = async function generateFarmerId() {
  const seq = await Counter.next("farmer", { startAt: 1001 });
  return `AGS-FRM-${seq}`;
};

farmerSchema.statics.upsertFromFirebase = async function upsertFromFirebase(auth, payload = {}) {
  const firebaseUid = auth.firebaseUid;
  const existing = await this.findOne({ firebaseUid });
  if (existing) {
    if (!existing.email && auth.email) existing.email = auth.email;
    if (!existing.fullName && auth.name) existing.fullName = auth.name;
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }

  const farmerId = await this.generateFarmerId();
  const doc = await this.create({
    firebaseUid,
    farmerId,
    email: (payload.email || auth.email || "").toLowerCase(),
    fullName: payload.fullName || auth.name || "Agri Farmer",
    phone: payload.phone,
    state: payload.state,
    district: payload.district,
    village: payload.village,
    landSize: payload.landSize ?? 0,
    cropInterest: payload.cropInterest,
    role: payload.role || "farmer",
  });
  return doc;
};

const Farmer = mongoose.model("Farmer", farmerSchema);
module.exports = Farmer;

