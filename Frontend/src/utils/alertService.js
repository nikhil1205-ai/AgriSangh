let alertContextValue = null;

export const setAlertContext = (context) => {
  alertContextValue = context;
};

export const showSuccess = (message, options = {}) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return null;
  }
  return alertContextValue.showSuccess(message, options);
};

export const showError = (message, options = {}) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return null;
  }
  return alertContextValue.showError(message, options);
};

export const showWarning = (message, options = {}) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return null;
  }
  return alertContextValue.showWarning(message, options);
};

export const showInfo = (message, options = {}) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return null;
  }
  return alertContextValue.showInfo(message, options);
};

export const showLoading = (message, options = {}) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return null;
  }
  return alertContextValue.showLoading(message, options);
};

export const updateAlert = (id, message, type, options = {}) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return;
  }
  return alertContextValue.updateAlert(id, message, type, options);
};

export const confirm = async (options = {}) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return false;
  }
  return alertContextValue.confirm(options);
};

export const dismissAlert = (id) => {
  if (!alertContextValue) {
    console.warn("Alert system not initialized");
    return;
  }
  return alertContextValue.dismissAlert(id);
};
