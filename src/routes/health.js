const express = require("express");
const { query } = require("../db/query");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    await query("SELECT 1");
    return res.json({
      success: true,
      message: "API is healthy",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
