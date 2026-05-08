const success = (res, data, message = "OK", status = 200) =>
  res.status(status).json({ success: true, message, data });

const error = (res, message = "Something went wrong", status = 500) =>
  res.status(status).json({ success: false, message });

module.exports = { success, error };
