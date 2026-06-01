import { useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const ConfirmModal = ({ isOpen, options, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (options.type) {
      case "danger":
        return <AlertCircle size={32} className="text-red-600" />;
      case "warning":
        return <AlertTriangle size={32} className="text-yellow-600" />;
      case "success":
        return <CheckCircle size={32} className="text-green-600" />;
      case "info":
        return <Info size={32} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getButtonStyles = () => {
    switch (options.type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "bg-green-600 hover:bg-green-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
          {options.title || "Confirm"}
        </h2>

        {/* Message */}
        <p className="text-slate-600 text-center mb-6">
          {options.message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition font-medium"
          >
            {options.cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition font-medium ${getButtonStyles()}`}
          >
            {options.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
