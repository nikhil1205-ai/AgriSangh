import { useState } from "react";
import { verifyBatch } from "../services/dashboardService";

const BuyerVerification = () => {
  const [batchId, setBatchId] = useState("");
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState("");

  const onVerify = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await verifyBatch(batchId);
      setBatch(data);
    } catch {
      setBatch(null);
      setError("Batch not found or invalid.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Buyer Batch Verification</h1>
        <p className="text-gray-600 text-sm mt-2">Enter collective Batch ID to validate authenticity.</p>
        <form onSubmit={onVerify} className="mt-4 flex gap-2">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
            placeholder="AGS-WHEAT-2026-001"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
          <button className="px-4 py-2 bg-green-800 text-white rounded-lg">Verify</button>
        </form>
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        {batch && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
            <p><strong>Batch:</strong> {batch.batchId}</p>
            <p><strong>Group:</strong> {batch.groupName}</p>
            <p><strong>Crop:</strong> {batch.cropType}</p>
            <p><strong>Production:</strong> {batch.estimatedProduction}</p>
            <p><strong>Status:</strong> {batch.authenticity}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerVerification;
