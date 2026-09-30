const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    farmerId: {
      type: String,
      required: true,
    },

    farmerName: {
      type: String,
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    cycle: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Paid",
    },

    paidDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Payment",
    paymentSchema
  );