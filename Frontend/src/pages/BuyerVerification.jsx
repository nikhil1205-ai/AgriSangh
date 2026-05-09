import { useState } from "react";
import { getBatchDetails, getGroupRoom } from "../services/dashboardService";

const BuyerVerification = () => {
  const [groupId, setGroupId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [interestSent, setInterestSent] = useState(false);

  const onVerify = async (e) => {
    e.preventDefault();
    setError("");
    setInterestSent(false);
    try {
      const [groupRoom, batch] = await Promise.all([getGroupRoom(groupId), getBatchDetails(batchId)]);
      setResult({ group: groupRoom.group, batch });
    } catch {
      setResult(null);
      setError("Batch not found or invalid.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Buyer Batch Verification</h1>
        <p className="text-gray-600 text-sm mt-2">Verify a collective using Group ID + Batch ID.</p>
        <form onSubmit={onVerify} className="mt-4 grid gap-2">
          <input
            className="border border-gray-200 rounded-lg px-3 py-2"
            placeholder="Group ID (e.g. AGS-GRP-0001)"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
          <input
            className="border border-gray-200 rounded-lg px-3 py-2"
            placeholder="AGS-WHEAT-2026-001"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
          <button className="px-4 py-2 bg-green-800 text-white rounded-lg">Verify</button>
        </form>
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        {result && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
            <p><strong>Group:</strong> {result.group?.name} ({result.group?.id})</p>
            <p><strong>Batch:</strong> {result.batch?.batchId}</p>
            <p><strong>Crop:</strong> {result.batch?.cropType}</p>
            <p><strong>Estimated Production:</strong> {result.batch?.estimatedProduction}</p>
            <p><strong>Status:</strong> Verified</p>

            <button
              onClick={() => setInterestSent(true)}
              className="mt-4 w-full px-4 py-2 bg-white border border-green-300 text-green-900 rounded-lg font-semibold"
            >
              Interested to Buy
            </button>
            {interestSent && (
              <p className="mt-2 text-xs text-green-900">
                Request recorded locally (MVP). Next: connect this to a buyer inquiry API.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerVerification;
