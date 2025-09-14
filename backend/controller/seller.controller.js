import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =========================
// Seller Login
// =========================
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: seller._id, name: seller.name, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send token as cookie
    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ success: true, message: "Login successful", seller: { id: seller._id, name: seller.name, email: seller.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// =========================
// Seller Logout
// =========================
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to logout" });
  }
};

// =========================
// Check Auth
// =========================
export const checkAuth = async (req, res) => {
  try {
    const seller = req.seller; // set by authSeller middleware
    if (!seller) return res.status(401).json({ success: false, message: "Not authenticated" });

    res.json({ success: true, message: "Seller is authenticated", seller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
