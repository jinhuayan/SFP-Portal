import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // Allow bypassing auth in development mode with a special header
    // This is useful for testing without JWT tokens
    if (
      process.env.NODE_ENV !== "production" &&
      req.headers["x-dev-bypass-auth"] === "true"
    ) {
      // Mock volunteer data for development
      req.user = {
        sub: 1,
        role: "COORDINATOR",
        email: "dev@local",
      };
      return next();
    }

    // Try to get token from cookie first, then fall back to Authorization header
    // Cookies are preferred because they're automatically sent by browser
    let token = req.cookies?.auth_token;

    if (!token) {
      // Fall back to Authorization header for backward compatibility
      token = req.header("Authorization")?.replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Verify token and extract payload (sub=userId, role, email)
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      // Attach decoded payload to request for downstream access
      req.user = decoded;

      next();
    } catch (error) {
      // Provide specific error messages for different JWT failure reasons
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Normalize role to uppercase for case-insensitive comparison
    const userRole = String(req.user.role || "").toUpperCase();

    // ADMIN role bypasses all role restrictions (superuser pattern)
    if (userRole === "ADMIN") {
      return next();
    }

    // If no specific roles required, allow any authenticated user
    if (!roles || roles.length === 0) return next();

    // Check if user's role matches any required role
    const normalizedRequired = roles.map((r) => String(r).toUpperCase());
    const allowed = normalizedRequired.includes(userRole);
    if (!allowed) {
      return res.status(403).json({
        message: "Access denied",
        requiredRoles: roles,
        userRole,
      });
    }

    next();
  };
};

// Helper function to get user from token without middleware
export const getUserFromToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
};
