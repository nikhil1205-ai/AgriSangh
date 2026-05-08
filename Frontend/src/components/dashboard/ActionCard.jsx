import { Link } from "react-router-dom";

const ActionCard = ({ title, description, to, cta }) => (
  <Link
    to={to}
    className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <p className="text-lg font-bold text-gray-900">{title}</p>
    <p className="text-sm text-gray-600 mt-2">{description}</p>
    <p className="text-sm font-semibold text-green-800 mt-4">{cta}</p>
  </Link>
);

export default ActionCard;
