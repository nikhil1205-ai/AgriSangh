const IrrigationCard = ({ irrigationPlan }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-500">Irrigation Planning</h3>
    <p className="text-gray-900 font-semibold mt-3">Schedule: {irrigationPlan?.schedule || "Pending"}</p>
    <p className="text-gray-600 text-sm mt-1">Reminder: {irrigationPlan?.reminder || "Not configured"}</p>
  </div>
);

export default IrrigationCard;
