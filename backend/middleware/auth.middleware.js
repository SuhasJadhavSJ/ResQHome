import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(404).json({ error: "Token not found" });

  // Extract the token from the header :
  const token = authHeader.split(" ")[1];

  // verify the token;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError")
        return res.status(401).json({ error: "Token expired" });
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

export default authMiddleware;
