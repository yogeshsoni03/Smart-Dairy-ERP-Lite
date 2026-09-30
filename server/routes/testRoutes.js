const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome Admin Dashboard",
    user: req.user,
  });
});

module.exports = router;