import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmailWithPassword } from "../models/UserModel.js";

// POST /auth/login
export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    getUserByEmailWithPassword(email, async (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        if (!user) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        // Compare submitted password against stored bcrypt hash
        const match = await bcrypt.compare(password, user.user_password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        // Issue JWT (never include password)
        const payload = {
            user_id:   user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_phone: user.user_phone,
            is_admin:  user.is_admin || false,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.json({ token, user: payload });
    });
};
