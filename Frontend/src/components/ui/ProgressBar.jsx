const ProgressBar = ({ value }) => (
  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
    <div className="h-full bg-green-700 rounded-full" style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

export default ProgressBar;
