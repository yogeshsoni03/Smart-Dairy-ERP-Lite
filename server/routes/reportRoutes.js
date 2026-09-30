const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  getDateReport,
  getFarmerReport,
  getTopFarmers,
  getMonthlyReport,
  downloadFarmerReportPDF,
  downloadMonthlyReport,
  downloadDateReportPDF,
} = require(
  "../controllers/reportController"
);

router.get(
  "/date",
  protect,
  getDateReport
);

router.get(
  "/farmer/:farmerId",
  protect,
  getFarmerReport
);

router.get(
  "/top-farmers",
  protect,
  getTopFarmers
);

router.get(
  "/monthly",
  protect,
  getMonthlyReport
);

router.get(
  "/farmer-pdf/:farmerId",
  protect,
  downloadFarmerReportPDF
);

router.get(
  "/monthly-pdf",
  protect,
  downloadMonthlyReport
);

router.get(
  "/date/pdf",
  protect,
  downloadDateReportPDF
);

module.exports = router;