const express = require("express");
const jwt = require("jsonwebtoken");
const { requireAdmin, JWT_SECRET } = require("../middleware/auth");
const { db } = require("../../db");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@vitarchive.com";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";

  if (email === adminEmail && password === adminPass) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    return res.json({ success: true, message: "Logged in successfully" });
  }

  return res.status(401).json({ success: false, error: "Invalid credentials" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true, message: "Logged out successfully" });
});

router.get("/stats", requireAdmin, async (req, res, next) => {
  try {
    const papersResult = await db.query("SELECT COUNT(*) FROM sources");
    const questionsResult = await db.query("SELECT COUNT(*) FROM questions");
    const pendingResult = await db.query("SELECT COUNT(*) FROM sources WHERE approval_status = 'PENDING'");

    res.json({
      success: true,
      data: {
        totalPapers: parseInt(papersResult.rows[0].count, 10),
        totalQuestions: parseInt(questionsResult.rows[0].count, 10),
        pendingReviews: parseInt(pendingResult.rows[0].count, 10)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
