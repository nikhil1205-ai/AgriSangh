const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Contribution = require("../models/contributionModel");
const Revenue = require("../models/revenueModel");
const { AppError } = require("../utils/errors");

async function calculateRevenueSplit({ auth, payload }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId: payload.groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  const totalRevenue = Number(payload.totalRevenue || 0);
  if (!totalRevenue || totalRevenue < 0) throw new AppError("Invalid totalRevenue", 400, "VALIDATION_ERROR");

  const contributions = await Contribution.find({ group: group._id }).populate("farmer");
  if (!contributions.length) throw new AppError("No contributions found for group", 400, "VALIDATION_ERROR");

  const totalPct = contributions.reduce((sum, c) => sum + Number(c.participationPercentage || 0), 0);
  if (!totalPct) throw new AppError("Total participationPercentage is 0", 400, "VALIDATION_ERROR");

  const distribution = contributions.map((c) => {
    const pct = (Number(c.participationPercentage || 0) / totalPct) * 100;
    const amount = Number(((pct / 100) * totalRevenue).toFixed(2));
    return {
      farmer: c.farmer._id,
      farmerId: c.farmer.farmerId,
      percentage: Number(pct.toFixed(2)),
      amount,
    };
  });

  const revenueId = await Revenue.generateRevenueId();
  const revenue = await Revenue.create({
    revenueId,
    group: group._id,
    totalRevenue,
    distribution,
  });

  return revenue;
}

module.exports = { calculateRevenueSplit };

