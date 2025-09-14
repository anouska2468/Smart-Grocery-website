import jwt from "jsonwebtoken";

export const authSeller = (req, res, next) => {
  try {
    const token = req.cookies.sellerToken; // must match the cookie set in login
    if (!token) return res.status(401).json({ success: false, message: "No token, unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = decoded; // now req.seller = {id, name, email}
    next();
  } catch (error) {
    console.error("AuthSeller error:", error.message);
    res.status(401).json({ success: false, message: "Invalid seller token" });
  }
};
