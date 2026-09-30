const MilkCollection = require("../models/MilkCollection");

const getFarmerLedger = async (req, res) => {
    try {
        const { farmerId } = req.params;

        const entries =
            await MilkCollection.find({
                farmerId,
            }).sort({
                createdAt: -1,
            });

        let formattedEntries = entries.map(
            (item) => ({
                ...item.toObject(),

                rate: Number(
                    item.rate.toFixed(2)
                ),

                amount: Number(
                    item.amount.toFixed(2)
                ),
            })
        );

        if (entries.length === 0) {
            return res.status(404).json({
                message:
                    "No Collection Found",
            });
        }

        const totalMilk = Number(
            entries
                .reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                )
                .toFixed(2)
        );

        const totalAmount = Number(
            entries
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                )
                .toFixed(2)
        );

        res.status(200).json({
            farmerId,
            farmerName: entries[0].farmerName,
            village: entries[0].village,
            totalCollections: entries.length,
            totalMilk,
            totalAmount,
            entries: formattedEntries,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getFarmerLedger,
};