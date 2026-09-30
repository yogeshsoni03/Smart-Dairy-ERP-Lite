const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    dairyName: {
      type: String,
      default: "Smart Dairy ERP",
    },

    ownerName: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    fatRate: {
      type: Number,
      default: 6,
    },

    snfRate: {
      type: Number,
      default: 2,
    },

    receiptTitle: {
      type: String,
      default: "Smart Dairy ERP",
    },

    footerText: {
      type: String,
      default: "Thank You",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Settings",
    settingsSchema
  );