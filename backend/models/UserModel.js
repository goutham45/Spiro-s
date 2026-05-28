import db from "../config/database.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

// Get user by email — NEVER returns password (safe for general use)
export const getUserByEmail = (email, result) => {
    db.query(
        "SELECT user_id, user_name, user_email, user_phone FROM user WHERE user_email = ?",
        [email],
        (err, results) => {
            if (err) { console.log(err); return result(err, null); }
            result(null, results[0]);
        }
    );
};

// Get user WITH password hash — only used by auth controller for login
export const getUserByEmailWithPassword = (email, result) => {
    db.query(
        "SELECT user_id, user_name, user_email, user_phone, user_password, is_admin FROM user WHERE user_email = ?",
        [email],
        (err, results) => {
            if (err) { console.log(err); return result(err, null); }
            result(null, results[0]);
        }
    );
};

// Insert new user — hashes password before storing
export const insertUser = async (data, result) => {
    try {
        const hashedPassword = await bcrypt.hash(data.user_password, SALT_ROUNDS);
        const safeData = { ...data, user_password: hashedPassword };

        db.query("INSERT INTO user SET ?", safeData, (err, results) => {
            if (err) { console.log(err); return result(err, null); }
            result(null, results);
        });
    } catch (err) {
        console.log(err);
        result(err, null);
    }
};
