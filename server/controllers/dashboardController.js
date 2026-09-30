const Farmer = require("../models/Farmer");
const MilkCollection = require("../models/MilkCollection");

const getDashboardStats = async (req, res) => {
    try {
        const totalFarmers =
            await Farmer.countDocuments();

        const today = new Date();

        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );

        const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        // Today's collections
        const todayCollections =
            await MilkCollection.find({
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay,
                },
            });

        // Morning
        const morningCollections =
            todayCollections.filter(
                (item) => item.shift === "Morning"
            );

        const morningMilk = Number(
            morningCollections
                .reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                )
                .toFixed(2)
        );

        const morningAmount = Number(
            morningCollections
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                )
                .toFixed(2)
        );

        // Evening
        const eveningCollections =
            todayCollections.filter(
                (item) => item.shift === "Evening"
            );

        const eveningMilk = Number(
            eveningCollections
                .reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                )
                .toFixed(2)
        );

        const eveningAmount = Number(
            eveningCollections
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                )
                .toFixed(2)
        );

        // Today totals
        const totalMilk = Number(
            todayCollections
                .reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                )
                .toFixed(2)
        );

        const totalAmount = Number(
            todayCollections
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                )
                .toFixed(2)
        );

        // Current Cycle (Hafta)

        const day = today.getDate();

        let cycleStartDay;
        let cycleEndDay;
        let cycleName;

        if (day <= 10) {
            cycleStartDay = 1;
            cycleEndDay = 10;
            cycleName = "1-10";
        } else if (day <= 20) {
            cycleStartDay = 11;
            cycleEndDay = 20;
            cycleName = "11-20";
        } else {
            cycleStartDay = 21;

            cycleEndDay = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            ).getDate();

            cycleName = "21-End";
        }

        const cycleStartDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            cycleStartDay
        );

        const cycleEndDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            cycleEndDay + 1
        );

        const cycleCollections =
            await MilkCollection.find({
                createdAt: {
                    $gte: cycleStartDate,
                    $lt: cycleEndDate,
                },
            });

        const cycleMilk = Number(
            cycleCollections
                .reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                )
                .toFixed(2)
        );

        const cycleAmount = Number(
            cycleCollections
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                )
                .toFixed(2)
        );

        // Monthly
        const monthlyCollections =
            await MilkCollection.find({
                createdAt: {
                    $gte: startOfMonth,
                },
            });

        const monthlyMilk = Number(
            monthlyCollections
                .reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                )
                .toFixed(2)
        );

        const monthlyAmount = Number(
            monthlyCollections
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                )
                .toFixed(2)
        );

        // Top Farmer
        const topFarmerData =
            await MilkCollection.aggregate([
                {
                    $group: {
                        _id: "$farmerId",
                        farmerName: {
                            $first: "$farmerName",
                        },
                        totalMilk: {
                            $sum: "$quantity",
                        },
                        totalAmount: {
                            $sum: "$amount",
                        },
                    },
                },
                {
                    $sort: {
                        totalMilk: -1,
                    },
                },
                {
                    $limit: 1,
                },
            ]);

        let topFarmer = null;

        if (topFarmerData.length > 0) {
            topFarmer = {
                ...topFarmerData[0],

                totalAmount: Number(
                    topFarmerData[0]
                        .totalAmount
                        .toFixed(2)
                ),

                totalMilk: Number(
                    topFarmerData[0]
                        .totalMilk
                        .toFixed(2)
                ),
            };
        }

        // Recent Collections
        const recentCollections =
            await MilkCollection.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select(
                    "collectionId farmerName quantity amount shift"
                );

        const totalCollections =
            todayCollections.length;

        res.status(200).json({

            totalFarmers,

            totalCollections,

            totalMilk,

            totalAmount,

            morningMilk,

            morningAmount,

            eveningMilk,

            eveningAmount,

            currentCycle: cycleName,

            currentCycleMilk: cycleMilk,

            currentCycleAmount: cycleAmount,

            monthlyMilk,

            monthlyAmount,

            topFarmer,

            recentCollections,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getDashboardChart = async (req, res) => {
    try {

        const chartData =
            await MilkCollection.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                            },
                        },

                        totalMilk: {
                            $sum: "$quantity",
                        },

                        totalAmount: {
                            $sum: "$amount",
                        },
                    },
                },

                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);

        const labels =
            chartData.map(
                (item) => item._id
            );

        const milkData =
            chartData.map((item) =>
                Number(
                    item.totalMilk.toFixed(2)
                )
            );

        const amountData =
            chartData.map((item) =>
                Number(
                    item.totalAmount.toFixed(2)
                )
            );

        res.status(200).json({
            labels,
            milkData,
            amountData,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getTopFarmersChart =
    async (req, res) => {
        try {

            const topFarmers =
                await MilkCollection.aggregate([
                    {
                        $group: {
                            _id: "$farmerId",

                            farmerName: {
                                $first:
                                    "$farmerName",
                            },

                            totalMilk: {
                                $sum:
                                    "$quantity",
                            },

                            totalAmount: {
                                $sum:
                                    "$amount",
                            },
                        },
                    },

                    {
                        $sort: {
                            totalMilk: -1,
                        },
                    },

                    {
                        $limit: 5,
                    },
                ]);

            const labels =
                topFarmers.map(
                    (item) =>
                        item.farmerName
                );

            const milkData =
                topFarmers.map(
                    (item) =>
                        Number(
                            item.totalMilk.toFixed(
                                2
                            )
                        )
                );

            const amountData =
                topFarmers.map(
                    (item) =>
                        Number(
                            item.totalAmount.toFixed(
                                2
                            )
                        )
                );

            res.status(200).json({
                labels,
                milkData,
                amountData,
            });

        } catch (error) {
            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

const getDashboardTrends =
    async (req, res) => {
        try {

            const today = new Date();

            // =====================
            // Last 10 Days
            // =====================

            const last10DaysDate =
                new Date();

            last10DaysDate.setDate(
                today.getDate() - 10
            );

            const last10Days =
                await MilkCollection.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: last10DaysDate,
                            },
                        },
                    },

                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format:
                                        "%Y-%m-%d",
                                    date:
                                        "$createdAt",
                                },
                            },

                            totalMilk: {
                                $sum:
                                    "$quantity",
                            },

                            totalAmount: {
                                $sum:
                                    "$amount",
                            },
                        },
                    },

                    {
                        $sort: {
                            _id: 1,
                        },
                    },
                ]);

            // =====================
            // Last 30 Days
            // =====================

            const last30DaysDate =
                new Date();

            last30DaysDate.setDate(
                today.getDate() - 30
            );

            const last30DaysData =
                await MilkCollection.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte:
                                    last30DaysDate,
                            },
                        },
                    },

                    {
                        $group: {
                            _id: null,

                            totalMilk: {
                                $sum:
                                    "$quantity",
                            },

                            totalAmount: {
                                $sum:
                                    "$amount",
                            },
                        },
                    },
                ]);

            // =====================
            // Last 12 Months
            // =====================

            const last12Months =
                await MilkCollection.aggregate([
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format:
                                        "%Y-%m",
                                    date:
                                        "$createdAt",
                                },
                            },

                            totalMilk: {
                                $sum:
                                    "$quantity",
                            },
                        },
                    },

                    {
                        $sort: {
                            _id: 1,
                        },
                    },
                ]);

            // =====================
            // Growth %
            // =====================

            const currentMonth =
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );

            const previousMonth =
                new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    1
                );

            const currentMonthData =
                await MilkCollection.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte:
                                    currentMonth,
                            },
                        },
                    },

                    {
                        $group: {
                            _id: null,

                            milk: {
                                $sum:
                                    "$quantity",
                            },

                            amount: {
                                $sum:
                                    "$amount",
                            },
                        },
                    },
                ]);

            const previousMonthData =
                await MilkCollection.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte:
                                    previousMonth,

                                $lt:
                                    currentMonth,
                            },
                        },
                    },

                    {
                        $group: {
                            _id: null,

                            milk: {
                                $sum:
                                    "$quantity",
                            },

                            amount: {
                                $sum:
                                    "$amount",
                            },
                        },
                    },
                ]);

            const currentMilk =
                currentMonthData[0]
                    ?.milk || 0;

            const previousMilk =
                previousMonthData[0]
                    ?.milk || 0;

            const currentAmount =
                currentMonthData[0]
                    ?.amount || 0;

            const previousAmount =
                previousMonthData[0]
                    ?.amount || 0;

            const milkGrowthPercent =
                previousMilk === 0
                    ? 100
                    : Number(
                        (
                            ((currentMilk -
                                previousMilk) /
                                previousMilk) *
                            100
                        ).toFixed(2)
                    );

            const amountGrowthPercent =
                previousAmount === 0
                    ? 100
                    : Number(
                        (
                            ((currentAmount -
                                previousAmount) /
                                previousAmount) *
                            100
                        ).toFixed(2)
                    );

            res.status(200).json({

                last10Days: {
                    labels:
                        last10Days.map(
                            (d) => d._id
                        ),

                    milkData:
                        last10Days.map(
                            (d) =>
                                Number(
                                    d.totalMilk.toFixed(
                                        2
                                    )
                                )
                        ),

                    amountData:
                        last10Days.map(
                            (d) =>
                                Number(
                                    d.totalAmount.toFixed(
                                        2
                                    )
                                )
                        ),
                },

                last30Days: {
                    totalMilk:
                        Number(
                            (
                                last30DaysData[0]
                                    ?.totalMilk ||
                                0
                            ).toFixed(2)
                        ),

                    totalAmount:
                        Number(
                            (
                                last30DaysData[0]
                                    ?.totalAmount ||
                                0
                            ).toFixed(2)
                        ),
                },

                last12Months: {
                    labels:
                        last12Months.map(
                            (m) => m._id
                        ),

                    milkData:
                        last12Months.map(
                            (m) =>
                                Number(
                                    m.totalMilk.toFixed(
                                        2
                                    )
                                )
                        ),
                },

                growth: {
                    milkGrowthPercent,
                    amountGrowthPercent,
                },
            });

        } catch (error) {
            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

module.exports = {
    getDashboardStats,
    getDashboardChart,
    getTopFarmersChart,
    getDashboardTrends,
};