import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader } from "lucide-react";

const AlertItem = ({ alert, onDismiss }) => {
  useEffect(() => {
    if (alert.duration !== 0) {
      const timer = setTimeout(() => onDismiss(alert.id), alert.duration);
      return () => clearTimeout(timer);
    }
  }, [alert, onDismiss]);

  const getStyles = () => {
    const baseStyles = "flex items-center gap-3 rounded-xl backdrop-blur-md border px-4 py-3 shadow-lg animate-slideIn";
    
    switch (alert.type) {
      case "success":
        return `${baseStyles} bg-green-500/10 border-green-500/30 text-green-700`;
      case "error":
        return `${baseStyles} bg-red-500/10 border-red-500/30 text-red-700`;
      case "warning":
        return `${baseStyles} bg-yellow-500/10 border-yellow-500/30 text-yellow-700`;
      case "info":
        return `${baseStyles} bg-blue-500/10 border-blue-500/30 text-blue-700`;
      case "loading":
        return `${baseStyles} bg-slate-500/10 border-slate-500/30 text-slate-700`;
      default:
        return baseStyles;
    }
  };

  const getIcon = () => {
    switch (alert.type) {
      case "success":
        return <CheckCircle size={20} className="shrink-0" />;
      case "error":
        return <AlertCircle size={20} className="shrink-0" />;
      case "warning":
        return <AlertTriangle size={20} className="shrink-0" />;
      case "info":
        return <Info size={20} className="shrink-0" />;
      case "loading":
        return <Loader size={20} className="shrink-0 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      <div className="flex-1">
        {alert.title && <p className="font-semibold text-sm">{alert.title}</p>}
        <p className={alert.title ? "text-xs opacity-90" : "text-sm"}>{alert.message}</p>
      </div>
      {alert.duration !== 0 && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="shrink-0 p-1 hover:opacity-70 transition"
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertItem;
