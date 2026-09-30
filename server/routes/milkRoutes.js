const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createMilkCollection,
  getFarmerMilkSummary,
  getAllCollections,
  updateMilkCollection,
  deleteMilkCollection,
  getFarmerByNumber,
} = require("../controllers/milkController");

router.post(
  "/",
  protect,
  createMilkCollection
);

// Farmer Summary
router.get(
  "/farmer/:farmerId",
  protect,
  getFarmerMilkSummary
);

router.get(
  "/number/:number",
  protect,
  getFarmerByNumber
);

router.get(
  "/",
  protect,
  getAllCollections
);



router.put(
  "/:collectionId",
  protect,
  updateMilkCollection
);

router.delete(
  "/:collectionId",
  protect,
  deleteMilkCollection
);

module.exports = router;