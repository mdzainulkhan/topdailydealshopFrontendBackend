
import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("JWT_SECRET is not configured");

        return res.status(500).json({
            success: false,
            message: "Server authentication is not configured",
        });
    }

    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    const token = authorization.slice(7);

    try {
        const payload = jwt.verify(token, secret, {
            issuer: "topdailydealshop-api",
            audience: "topdailydealshop-admin",
        });

        if (
            typeof payload === "string" ||
            payload.role !== "admin" ||
            typeof payload.sub !== "string"
        ) {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        req.admin = {
            id: payload.sub,
            role: payload.role,
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
