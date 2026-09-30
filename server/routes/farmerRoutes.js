const express = require("express");
const {
  createFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  getFarmerProfile,
} = require("../controllers/farmerController");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createFarmer);

router.get("/", protect, getFarmers);

router.get(
  "/:farmerId/profile",
  protect,
  getFarmerProfile
);

router.get(
  "/profile/:farmerId",
  protect,
  getFarmerProfile
);

router.get("/:id", protect, getFarmerById);

router.put("/:id", protect, updateFarmer);

router.delete("/:id", protect, deleteFarmer);



module.exports = router;