const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "未授權，請先登入" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ error: "無效的 Token，請重新登入" });
    }
}

module.exports = authMiddleware;