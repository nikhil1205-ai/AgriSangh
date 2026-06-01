import { useState, useCallback } from "react";
import { AlertContext } from "../../context/alertContext.jsx";
import AlertContainer from "./AlertContainer";
import ConfirmModal from "./ConfirmModal";
import { setAlertContext } from "../../utils/alertService";

const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    options: {},
  });
  const [confirmResolver, setConfirmResolver] = useState(null);

  const addAlert = useCallback((type, message, options = {}) => {
    const id = `${type}-${Date.now()}-${Math.random()}`;
    const { duration = 4000, title = null } = options;

    const alert = {
      id,
      type,
      message,
      title,
      duration,
    };

    setAlerts((prev) => [...prev, alert]);
    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const updateAlert = useCallback((id, message, type, options = {}) => {
    const { duration = 4000, title = null } = options;

    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? { ...alert, message, type, title, duration }
          : alert
      )
    );
  }, []);

  const showAlert = useCallback(
    (type, message, options) => addAlert(type, message, options),
    [addAlert]
  );

  const showSuccess = useCallback(
    (message, options) => showAlert("success", message, options),
    [showAlert]
  );

  const showError = useCallback(
    (message, options) => showAlert("error", message, options),
    [showAlert]
  );

  const showWarning = useCallback(
    (message, options) => showAlert("warning", message, options),
    [showAlert]
  );

  const showInfo = useCallback(
    (message, options) => showAlert("info", message, options),
    [showAlert]
  );

  const showLoading = useCallback(
    (message, options) => showAlert("loading", message, { ...options, duration: 0 }),
    [showAlert]
  );

  const dismiss = useCallback((id) => removeAlert(id), [removeAlert]);

  const confirm = useCallback(
    (options = {}) => {
      return new Promise((resolve) => {
        setConfirmConfig({ isOpen: true, options });
        setConfirmResolver(() => resolve);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (confirmResolver) {
      confirmResolver(true);
    }
    setConfirmConfig({ isOpen: false, options: {} });
    setConfirmResolver(null);
  }, [confirmResolver]);

  const handleCancel = useCallback(() => {
    if (confirmResolver) {
      confirmResolver(false);
    }
    setConfirmConfig({ isOpen: false, options: {} });
    setConfirmResolver(null);
  }, [confirmResolver]);

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateAlert,
    confirm,
    dismissAlert: dismiss,
  };

  // Set the context for alertService utility functions
  setAlertContext(value);

  return (
    <AlertContext.Provider value={value}>
      <AlertContainer alerts={alerts} onDismiss={removeAlert} />
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        options={confirmConfig.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
