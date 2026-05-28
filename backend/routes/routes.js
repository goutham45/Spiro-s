import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { login } from "../controllers/auth.js";

import { showFoods, showFoodById, createFood, updateFood, deleteFood } from "../controllers/food.js";
import { checkEmailExists, createAccount } from "../controllers/user.js";
import { addItems, getItem, updateItem, allItems, deleteItem, deleteItems } from "../controllers/cart.js";
import { createBooking } from "../controllers/booktable.js";
import { createBillDetails, getBillDetailsById } from "../controllers/billdetails.js";
import {
    showNewestStatusId, createBillStatus, getAllBillsByUser,
    getAllBillsByBill, getAllBills, updateBillStatus, updateBillPaid, cancelBillStatus,
} from "../controllers/billstatus.js";

const router = express.Router();

// ── AUTH ─────────────────────────────────────────────────────────
router.post("/auth/login", login);

// ── FOOD (public read, admin write) ──────────────────────────────
router.get("/foods",        showFoods);
router.get("/foods/:id",    showFoodById);
router.post("/foods",       requireAdmin, createFood);
router.put("/foods/:id",    requireAdmin, updateFood);
router.delete("/foods/:id", requireAdmin, deleteFood);

// ── USER ─────────────────────────────────────────────────────────
router.get("/users/:email",  checkEmailExists);   // only returns {exists: bool}
router.post("/users/",       createAccount);

// ── CART (requires login) ─────────────────────────────────────────
router.post("/cartItem",                requireAuth, addItems);
router.get("/cartItem/:user_id/:food_id", requireAuth, getItem);
router.get("/cartItem/:id",             requireAuth, allItems);
router.put("/cartItem/",                requireAuth, updateItem);
router.delete("/cartItem/:user_id/:food_id", requireAuth, deleteItem);
router.delete("/cartItem/:id",          requireAuth, deleteItems);

// ── BOOKINGS (public – no login required) ────────────────────────
router.post("/booking", createBooking);

// ── BILLS (requires login) ────────────────────────────────────────
router.post("/billdetails",         requireAuth, createBillDetails);
router.get("/billdetails/:id",      requireAuth, getBillDetailsById);

router.get("/billstatus/new",       requireAuth, showNewestStatusId);
router.post("/billstatus",          requireAuth, createBillStatus);
router.get("/billstatus/user/:id",  requireAuth, getAllBillsByUser);
router.get("/billstatus/bill/:id",  requireAuth, getAllBillsByBill);
router.put("/billstatus/:id",       requireAuth, updateBillStatus);
router.put("/billstatus/paid/:id",  requireAdmin, updateBillPaid);
router.put("/billstatus/cancel/:id",requireAuth, cancelBillStatus);
router.get("/billstatus",           requireAdmin, getAllBills);   // admin only

export default router;
