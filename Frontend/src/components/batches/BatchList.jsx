const BatchList = ({ batches }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-500">Active Batches</h3>
    <div className="space-y-2 mt-3">
      {batches?.length ? (
        batches.map((batch) => (
          <div key={batch.id} className="p-3 bg-green-50 rounded-lg text-sm text-green-900">
            {batch.batchId} - {batch.cropType} ({batch.authenticity})
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No active batch yet.</p>
      )}
    </div>
  </div>
);

export default BatchList;
