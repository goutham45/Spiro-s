import jwt from "jsonwebtoken";

// Verify JWT token on protected routes
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { user_id, user_email, user_name }
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Only allow admin (checked by is_admin flag in token)
export const requireAdmin = (req, res, next) => {
    requireAuth(req, res, () => {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: "Admin access required." });
        }
        next();
    });
};
