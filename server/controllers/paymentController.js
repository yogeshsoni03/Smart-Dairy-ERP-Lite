const MilkCollection = require("../models/MilkCollection");
const Farmer = require("../models/Farmer");
const Payment =
    require("../models/Payment");
const PDFDocument =
    require("pdfkit");


const getPayments = async (req, res) => {
    try {
        const { month, year, cycle } = req.query;

        if (!month || !year || !cycle) {
            return res.status(400).json({
                message:
                    "month, year and cycle are required",
            });
        }

        const monthNum = Number(month);
        const yearNum = Number(year);
        const cycleNum = Number(cycle);

        let startDay;
        let endDay;

        if (cycleNum === 1) {
            startDay = 1;
            endDay = 10;
        } else if (cycleNum === 2) {
            startDay = 11;
            endDay = 20;
        } else if (cycleNum === 3) {
            startDay = 21;

            endDay = new Date(
                yearNum,
                monthNum,
                0
            ).getDate();
        } else {
            return res.status(400).json({
                message:
                    "cycle must be 1, 2 or 3",
            });
        }

        const startDate = new Date(
            yearNum,
            monthNum - 1,
            startDay
        );

        const endDate = new Date(
            yearNum,
            monthNum - 1,
            endDay + 1
        );

        const payments =
            await MilkCollection.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lt: endDate,
                        },
                    },
                },

                {
                    $group: {
                        _id: "$farmerId",

                        totalCollections: {
                            $sum: 1,
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
                        totalAmount: -1,
                    },
                },
            ]);

        const formattedPayments =
            await Promise.all(
                payments.map(async (item) => {

                    const farmer =
                        await Farmer.findOne({
                            farmerId: item._id,
                        });

                    const paymentRecord =
                        await Payment.findOne({
                            farmerId: item._id,
                            month: monthNum,
                            year: yearNum,
                            cycle: cycleNum,
                        });

                    return {
                        paymentId:
                            paymentRecord?._id || null,

                        farmerId: item._id,

                        farmerName:
                            farmer?.name || "",

                        village:
                            farmer?.village || "",

                        totalCollections:
                            item.totalCollections,

                        totalMilk: Number(
                            item.totalMilk.toFixed(2)
                        ),

                        totalAmount: Number(
                            item.totalAmount.toFixed(2)
                        ),

                        status:
                            paymentRecord
                                ? paymentRecord.status
                                : "Pending",

                        paidDate:
                            paymentRecord
                                ? paymentRecord.paidDate
                                : null,
                    };
                })
            );

        res.status(200).json({
            month: monthNum,
            year: yearNum,
            cycle: cycleNum,
            payments:
                formattedPayments,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const markPaymentPaid =
    async (req, res) => {
        try {
            const {
                farmerId,
                farmerName,
                month,
                year,
                cycle,
                amount,
            } = req.body;

            const existingPayment =
                await Payment.findOne({
                    farmerId,
                    month,
                    year,
                    cycle,
                });

            if (existingPayment) {
                return res.status(400).json({
                    message:
                        "Payment already marked as paid",
                });
            }

            const payment =
                await Payment.create({
                    farmerId,
                    farmerName,
                    month,
                    year,
                    cycle,
                    amount,
                    status: "Paid",
                    paidDate: new Date(),
                });

            res.status(201).json({
                message:
                    "Payment marked as paid",
                payment,
            });

        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    };

const markPaymentUnpaid = async (req, res) => {
    try {

        const { paymentId } = req.params;

        const payment =
            await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                message: "Payment Not Found",
            });
        }

        await payment.deleteOne();

        res.status(200).json({
            message:
                "Payment Changed To Pending",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};


const getPaymentHistory =
    async (req, res) => {
        try {

            const payments =
                await Payment.find()
                    .sort({
                        paidDate: -1,
                    });

            res.status(200).json(
                payments
            );

        } catch (error) {
            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

const generatePaymentReceipt =
    async (req, res) => {
        try {

            const { farmerId } =
                req.params;

            const {
                month,
                year,
                cycle,
            } = req.query;

            const payment =
                await Payment.findOne({
                    farmerId,
                    month: Number(month),
                    year: Number(year),
                    cycle: Number(cycle),
                });

            const paymentStatus =
                payment?.status || "Pending";

            const paidDate =
                payment?.paidDate || null;

            const farmer =
                await Farmer.findOne({
                    farmerId,
                });

            let startDay;
            let endDay;
            let cycleName;

            if (Number(cycle) === 1) {
                startDay = 1;
                endDay = 10;
                cycleName = "1-10";
            }
            else if (Number(cycle) === 2) {
                startDay = 11;
                endDay = 20;
                cycleName = "11-20";
            }
            else {
                startDay = 21;

                endDay = new Date(
                    Number(year),
                    Number(month),
                    0
                ).getDate();

                cycleName = "21-End";
            }

            const startDate = new Date(
                Number(year),
                Number(month) - 1,
                startDay
            );

            const endDate = new Date(
                Number(year),
                Number(month) - 1,
                endDay + 1
            );

            const collections =
                await MilkCollection.find({
                    farmerId,

                    createdAt: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                }).sort({
                    createdAt: 1,
                });

            // Totals calculate from collections

            const totalCollections =
                collections.length;

            const totalMilk =
                collections.reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                );

            const totalAmount =
                collections.reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                );

            const doc =
                new PDFDocument({
                    margin: 50,
                });

            res.setHeader(
                "Content-Type",
                "application/pdf"
            );

            res.setHeader(
                "Content-Disposition",
                `inline; filename=receipt-${farmerId}.pdf`
            );

            doc.pipe(res);

            // Header

            doc
                .fontSize(22)
                .text(
                    "SMART DAIRY ERP",
                    {
                        align: "center",
                    }
                );

            doc.moveDown();

            doc
                .fontSize(16)
                .text(
                    "MILK PAYMENT RECEIPT",
                    {
                        align: "center",
                    }
                );

            doc.moveDown(2);

            doc.fontSize(12);

            doc.text(`Farmer ID : ${farmerId}`);
            doc.text(`Farmer Name : ${farmer?.name || ""}`);
            doc.text(`Village : ${farmer?.village || ""}`);

            doc.moveDown();

            doc.text(`Month : ${month}/${year}`);
            doc.text(`Cycle : ${cycleName}`);

            doc.moveDown();

            doc.text(
                "================================================================"
            );

            doc.text(
                "Date         Shift      Qty     FAT     SNF     Amount"
            );

            doc.text(
                "================================================================"
            );

            // Table Rows

            collections.forEach((item) => {

                const date =
                    new Date(
                        item.createdAt
                    ).toLocaleDateString(
                        "en-GB"
                    );

                const row =
                    `${date.padEnd(13)} ${item.shift.padEnd(10)} ${String(item.quantity).padEnd(7)} ${String(item.fat).padEnd(7)} ${String(item.snf).padEnd(7)} Rs ${Number(item.amount).toFixed(2)}`;

                doc.text(row);
            });

            doc.text(
                "================================================================"
            );

            doc.moveDown();

            doc.text(
                `Total Collections : ${totalCollections}`
            );

            doc.text(
                `Total Milk : ${totalMilk.toFixed(2)} L`
            );

            doc.text(
                `Total Amount : Rs ${totalAmount.toFixed(2)}`
            );

            doc.moveDown();

            doc.text(
                `Status : ${paymentStatus}`
            );

            doc.text(
                `Paid Date : ${paidDate
                    ? new Date(
                        paidDate
                    ).toLocaleDateString(
                        "en-GB"
                    )
                    : "-"
                }`
            );
            doc.moveDown(2);

            doc.text(
                "Thank you for supplying milk.",
                {
                    align: "center",
                }
            );

            doc.text(
                "Smart Dairy ERP",
                {
                    align: "center",
                }
            );

            doc.end();

        } catch (error) {
            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

const revertPayment =
    async (req, res) => {

        try {

            const { paymentId } =
                req.params;

            const payment =
                await Payment.findById(
                    paymentId
                );

            if (!payment) {

                return res.status(404).json({
                    message:
                        "Payment Not Found",
                });
            }

            await payment.deleteOne();

            res.status(200).json({
                message:
                    "Payment Reverted Successfully",
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

module.exports = {
    getPayments,
    markPaymentPaid,
    markPaymentUnpaid,
    getPaymentHistory,
    generatePaymentReceipt,
    revertPayment,
};