const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

counterSchema.statics.next = async function next(key, { startAt = 1 } = {}) {
  // Use a single atomic pipeline update to avoid $inc + $setOnInsert conflicts on `seq`.
  // - If document doesn't exist: initialize seq to startAt-1, then add 1 => startAt.
  // - If document exists: add 1.
  const updated = await this.findOneAndUpdate(
    { key },
    [
      {
        $set: {
          key: { $ifNull: ["$key", key] },
          seq: { $ifNull: ["$seq", startAt - 1] },
        },
      },
      { $set: { seq: { $add: ["$seq", 1] } } },
    ],
    { new: true, upsert: true }
  );
  return updated.seq;
};

const Counter = mongoose.model("Counter", counterSchema);
module.exports = Counter;

