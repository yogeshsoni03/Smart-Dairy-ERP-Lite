const express = require("express");
const {
  getPayments,
  markPaymentPaid,
  markPaymentUnpaid,
  getPaymentHistory,
  generatePaymentReceipt,
  revertPayment,
} = require(
  "../controllers/paymentController"
);

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

router.get(
    "/",
    protect,
    getPayments
);

router.get(
  "/history",
  protect,
  getPaymentHistory
);

router.post(
  "/pay",
  protect,
  markPaymentPaid
);

router.get(
  "/receipt/:farmerId",
  protect,
  generatePaymentReceipt
);

router.delete(
    "/revert/:paymentId",
    protect,
    revertPayment
);

router.delete(
  "/unpay/:paymentId",
  protect,
  markPaymentUnpaid
);

module.exports = router;