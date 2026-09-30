const express = require("express");

const router = express.Router();

const { protect } =
  require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getDashboardChart,
  getTopFarmersChart,
  getDashboardTrends,
} = require(
  "../controllers/dashboardController"
);

router.get(
    "/chart",
    protect,
    getDashboardChart
);

router.get(
    "/top-farmers",
    protect,
    getTopFarmersChart
);

router.get(
    "/",
    protect,
    getDashboardStats
);

router.get(
  "/trends",
  protect,
  getDashboardTrends
);

module.exports = router;