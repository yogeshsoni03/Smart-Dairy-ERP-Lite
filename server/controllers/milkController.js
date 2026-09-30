const MilkCollection = require("../models/MilkCollection");
const Settings = require("../models/Settings");
const Farmer = require("../models/Farmer");

const createMilkCollection = async (req, res) => {
    try {
        const {
            farmerId,
            shift,
            quantity,
            fat,
            snf,
        } = req.body;

        // Farmer Validation
        const farmer = await Farmer.findOne({
            farmerId,
        });

        if (!farmer) {
            return res.status(404).json({
                message: "Farmer Not Found",
            });
        }

        const lastCollection =
            await MilkCollection.findOne({
                farmerId,
            }).sort({ createdAt: -1 });

        let nextNumber = 1;

        if (lastCollection) {

            const lastId =
                lastCollection.collectionId;

            const lastSeq =
                parseInt(
                    lastId.split("COL")[1]
                );

            nextNumber = lastSeq + 1;
        }

        const collectionId =
            `${farmerId}-COL${String(
                nextNumber
            ).padStart(3, "0")}`;

        let fatRate = 6;
        let snfRate = 2;

        const settings =
            await Settings.findOne();

        if (settings) {
            fatRate = settings.fatRate;
            snfRate = settings.snfRate;
        }

        const rate = Number(
            (
                fat * fatRate +
                snf * snfRate
            ).toFixed(2)
        );

        const amount = Number(
            (
                quantity * rate
            ).toFixed(2)
        );

        // SAVE COLLECTION
        const collection =
            await MilkCollection.create({
                collectionId,

                farmerId,

                farmerName: farmer.name,

                village: farmer.village,

                shift,

                quantity,

                fat,

                snf,

                fatRateUsed: fatRate,

                snfRateUsed: snfRate,

                rate,

                amount,
            });

        res.status(201).json({
            message:
                "Milk Collection Saved Successfully",
            collection,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getFarmerMilkSummary = async (req, res) => {
    try {
        const { farmerId } = req.params;

        const collections =
            await MilkCollection.find({
                farmerId,
            });

        if (collections.length === 0) {
            return res.status(404).json({
                message:
                    "No Milk Collection Found",
            });
        }

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
        res.status(200).json({
            farmerId,

            farmerName:
                collections[0].farmerName,

            village:
                collections[0].village,

            totalCollections:
                collections.length,

            totalMilk,

            totalAmount,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllCollections = async (req, res) => {
    try {
        const collections = await MilkCollection.find()
            .sort({ createdAt: -1 });

        res.status(200).json(collections);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateMilkCollection =
    async (req, res) => {
        try {

            const { collectionId } =
                req.params;

            const {
                quantity,
                fat,
                snf,
                shift,
            } = req.body;

            const collection =
                await MilkCollection.findOne({
                    collectionId,
                });

            if (!collection) {
                return res.status(404).json({
                    message:
                        "Collection not found",
                });
            }

            const settings =
                await Settings.findOne();

            const fatRate =
                settings?.fatRate || 6;

            const snfRate =
                settings?.snfRate || 2;

            const rate = Number(
                (
                    fat * fatRate +
                    snf * snfRate
                ).toFixed(2)
            );

            const amount = Number(
                (
                    quantity * rate
                ).toFixed(2)
            );

            collection.quantity =
                quantity;

            collection.fat =
                fat;

            collection.snf =
                snf;

            collection.shift =
                shift;

            collection.rate =
                rate;

            collection.amount =
                amount;

            await collection.save();

            res.status(200).json({
                message:
                    "Collection Updated Successfully",
                collection,
            });

        } catch (error) {
            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

const deleteMilkCollection =
    async (req, res) => {
        try {

            const { collectionId } =
                req.params;

            const collection =
                await MilkCollection.findOne({
                    collectionId,
                });

            if (!collection) {
                return res.status(404).json({
                    message:
                        "Collection not found",
                });
            }

            await collection.deleteOne();

            res.status(200).json({
                message:
                    "Collection Deleted Successfully",
            });

        } catch (error) {
            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

const getFarmerByNumber = async (req, res) => {
    try {

        const number = req.params.number;

        const farmerId =
            `FARM${String(number).padStart(3, "0")}`;

        const farmer =
            await Farmer.findOne({
                farmerId,
            });

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

module.exports = {
    createMilkCollection,
    getFarmerMilkSummary,
    getAllCollections,
    updateMilkCollection,
    deleteMilkCollection,
    getFarmerByNumber,
};