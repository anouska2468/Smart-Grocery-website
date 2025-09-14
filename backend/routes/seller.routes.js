import express from "express";
import Seller from "../models/Seller.js"; // adjust path if needed
import bcrypt from "bcryptjs";

import {
  checkAuth,
  sellerLogin,
  sellerLogout,
} from "../controller/seller.controller.js";
import { authSeller } from "../middlewares/authSeller.js";
const router = express.Router();

router.post("/login", sellerLogin);
router.get("/is-auth", authSeller, checkAuth);
router.get("/logout", authSeller, sellerLogout);
// TEMP ROUTE: Create a test seller
router.post("/create-test-seller", async (req, res) => {
  try {
    const exists = await Seller.findOne({ email: "seller@test.com" });
    if (exists) return res.json({ success: true, message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash("123456", 10);
    const seller = await Seller.create({
      name: "Test Seller",
      email: "seller@test.com",
      password: hashedPassword,
    });

    res.json({ success: true, seller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create seller" });
  }
});

export default router;
