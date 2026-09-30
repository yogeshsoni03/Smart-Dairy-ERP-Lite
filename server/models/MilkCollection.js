const mongoose = require("mongoose");

const milkCollectionSchema = new mongoose.Schema(
  {
    collectionId: {
      type: String,
      required: true,
      unique: true,
    },

    farmerId: {
      type: String,
      required: true,
    },

    farmerName: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    shift: {
      type: String,
      enum: ["Morning", "Evening"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    fat: {
      type: Number,
      required: true,
    },

    snf: {
      type: Number,
      required: true,
    },

    fatRateUsed: Number,

    snfRateUsed: Number,

    rate: Number,

    amount: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MilkCollection",
  milkCollectionSchema
);