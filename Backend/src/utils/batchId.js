const generateBatchId = (cropType, serial = 1) => {
  const year = new Date().getFullYear();
  const crop = (cropType || "MIXED").toUpperCase().replace(/\s+/g, "");
  return `AGS-${crop}-${year}-${String(serial).padStart(3, "0")}`;
};

module.exports = { generateBatchId };
