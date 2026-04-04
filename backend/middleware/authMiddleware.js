const jwt = require("jsonwebtoken");

const protect = (requiredRole = null) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing. Unauthorized access." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Access denied." });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token. Unauthorized access." });
    }
  };
};

module.exports = { protect };
