// backend/middleware/corp.middleware.js
export default function corpMiddleware(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user.role !== "corporation")
      return res.status(403).json({ success: false, message: "Forbidden: corp only" });
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
