const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  getFarmerLedger,
} = require(
  "../controllers/ledgerController"
);

router.get(
  "/:farmerId",
  protect,
  getFarmerLedger
);

module.exports = router;