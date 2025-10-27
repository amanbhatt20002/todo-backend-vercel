import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Please log in again." });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); 

    // Attach user info to the request object
    req.user = { id: decoded.id };

    next(); // continue to next middleware or controller
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    // Handle specific JWT errors for clarity
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token. Please log in again." });
    }

    res.status(401).json({ success: false, message: "Unauthorized request" });
  }
};

export default authUser;
