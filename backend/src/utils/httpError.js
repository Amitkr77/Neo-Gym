// Translates Mongoose/Mongo errors into safe client responses without leaking internals.
export const sendError = (res, error, fallbackMessage = "Something went wrong. Please try again.") => {
  if (error?.name === "ValidationError") {
    const details = Object.values(error.errors || {}).map((e) => e.message);
    return res.status(400).json({ message: details[0] || "Invalid input", errors: details });
  }
  if (error?.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for ${error.path}` });
  }
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || error.keyPattern || {})[0] || "value";
    return res.status(409).json({ message: `That ${field} is already in use` });
  }
  console.error(error);
  return res.status(500).json({ message: fallbackMessage });
};
