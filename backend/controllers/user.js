import { getUserByEmail, insertUser } from "../models/UserModel.js";

// GET /users/:email — checks if email exists (for registration duplicate check)
// Returns only existence, no sensitive data
export const checkEmailExists = (req, res) => {
    getUserByEmail(req.params.email, (err, user) => {
        if (err) return res.status(500).json({ message: "Server error" });
        res.json({ exists: !!user });
    });
};

// POST /users/ — register new account
export const createAccount = (req, res) => {
    const { user_name, user_email, user_phone, user_password, user_birth, user_gender } = req.body;

    // Basic server-side validation
    if (!user_name || !user_email || !user_password) {
        return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (user_password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    // Check email not already taken
    getUserByEmail(user_email, (err, existing) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (existing) return res.status(409).json({ message: "Email already registered." });

        const data = { user_name, user_email, user_phone, user_password, user_birth, user_gender };
        insertUser(data, (err2) => {
            if (err2) return res.status(500).json({ message: "Could not create account." });
            res.status(201).json({ message: "Account created successfully." });
        });
    });
};
