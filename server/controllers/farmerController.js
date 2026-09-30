const Farmer = require("../models/Farmer");
const MilkCollection = require("../models/MilkCollection");

const createFarmer = async (req, res) => {
  try {
    const {
      name,
      mobile,
      village,
      address,
      cattleCount,
    } = req.body;

    const lastFarmer =
      await Farmer.findOne()
        .sort({ createdAt: -1 });

    let farmerId = "FARM001";

    if (lastFarmer) {

      const lastNumber = parseInt(
        lastFarmer.farmerId.replace(
          "FARM",
          ""
        )
      );

      farmerId =
        `FARM${String(
          lastNumber + 1
        ).padStart(3, "0")}`;
    }

    const farmer = await Farmer.create({
      farmerId,
      name,
      mobile,
      village,
      address,
      cattleCount,
    });

    res.status(201).json({
      message: "Farmer Created Successfully",
      farmer,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();

    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer Not Found",
      });
    }

    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer Not Found",
      });
    }

    res.status(200).json({
      message: "Farmer Updated Successfully",
      farmer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer Not Found",
      });
    }

    await farmer.deleteOne();

    res.status(200).json({
      message: "Farmer Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFarmerProfile = async (req, res) => {
  try {

    const { farmerId } = req.params;

    const farmer = await Farmer.findOne({
      farmerId,
    });

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer Not Found",
      });
    }

    const collections =
      await MilkCollection.find({
        farmerId,
      }).sort({
        createdAt: -1,
      });

    const totalCollections =
      collections.length;

    const totalMilk = Number(
      collections
        .reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        )
        .toFixed(2)
    );

    const totalAmount = Number(
      collections
        .reduce(
          (sum, item) =>
            sum + item.amount,
          0
        )
        .toFixed(2)
    );

    const recentCollections =
      collections.slice(0, 10);

    res.status(200).json({
      farmer,
      summary: {
        totalCollections,
        totalMilk,
        totalAmount,
      },
      recentCollections,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  getFarmerProfile,
};