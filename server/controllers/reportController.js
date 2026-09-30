const MilkCollection = require("../models/MilkCollection");
const Farmer = require("../models/Farmer");
const PDFDocument = require("pdfkit");

const getDateReport = async (req, res) => {
  try {

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const startDate = new Date(date);

    const endDate = new Date(date);

    endDate.setDate(
      endDate.getDate() + 1
    );

    const collections =
      await MilkCollection.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
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

    const morningCollections =
      collections.filter(
        (item) =>
          item.shift === "Morning"
      );

    const eveningCollections =
      collections.filter(
        (item) =>
          item.shift === "Evening"
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

    res.status(200).json({
      date,

      totalCollections,

      totalMilk,

      totalAmount,

      morningMilk,

      morningAmount,

      eveningMilk,

      eveningAmount,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFarmerReport = async (req, res) => {
  try {

    const { farmerId } = req.params;

    const collections =
      await MilkCollection.find({
        farmerId,
      }).sort({
        createdAt: -1,
      });

    const farmer =
      await Farmer.findOne({
        farmerId,
      });

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer Not Found",
      });
    }

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

    res.status(200).json({
      farmerId,

      farmerName:
        farmer.name,

      village:
        farmer.village,

      totalCollections,

      totalMilk: Number(
        totalMilk.toFixed(2)
      ),

      totalAmount: Number(
        totalAmount.toFixed(2)
      ),

      collections,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getTopFarmers = async (req, res) => {

  try {

    const topFarmers =
      await MilkCollection.aggregate([
        {
          $group: {
            _id: "$farmerId",

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

        {
          $limit: 10,
        },
      ]);

    const result =
      await Promise.all(

        topFarmers.map(
          async (item) => {

            const farmer =
              await Farmer.findOne({
                farmerId:
                  item._id,
              });

            return {

              farmerId:
                item._id,

              farmerName:
                farmer?.name || "",

              village:
                farmer?.village || "",

              totalMilk:
                item.totalMilk,

              totalAmount:
                item.totalAmount,
            };
          }
        )
      );

    res.status(200).json(
      result
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

const downloadFarmerReportPDF =
  async (req, res) => {

    try {

      const { farmerId } =
        req.params;

      const farmer =
        await Farmer.findOne({
          farmerId,
        });

      if (!farmer) {
        return res.status(404).json({
          message:
            "Farmer Not Found",
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
        `attachment; filename=${farmerId}-report.pdf`
      );

      doc.pipe(res);

      doc
        .fontSize(22)
        .text(
          "SMART DAIRY ERP",
          { align: "center" }
        );

      doc.moveDown();

      doc
        .fontSize(18)
        .text(
          "FARMER REPORT",
          { align: "center" }
        );

      doc.moveDown(2);

      doc.text(
        `Farmer ID : ${farmer.farmerId}`
      );

      doc.text(
        `Name : ${farmer.name}`
      );

      doc.text(
        `Village : ${farmer.village}`
      );

      doc.moveDown();

      doc.text(
        `Total Collections : ${totalCollections}`
      );

      doc.text(
        `Total Milk        : ${totalMilk.toFixed(2)} L`
      );

      doc.text(
        `Total Amount      : Rs. ${totalAmount.toFixed(2)}`
      );
      doc.moveDown();

      doc.text(
        "================================================"
      );

      doc.font("Courier-Bold");

      const y = doc.y;

      doc.text("Date", 50, y);
      doc.text("Shift", 130, y);
      doc.text("Qty", 220, y);
      doc.text("FAT", 280, y);
      doc.text("SNF", 340, y);
      doc.text("Amount", 420, y);

      doc.moveDown();
      doc.moveDown();

      doc.font("Courier");

      collections.forEach((item) => {

        const date =
          new Date(item.createdAt)
            .toLocaleDateString("en-GB");

        const y = doc.y;

        doc.text(
          date,
          10,
          y,
          { width: 200 }
        );

        doc.text(
          item.shift,
          130,
          y,
          { width: 90 }
        );

        doc.text(
          item.quantity.toString(),
          220,
          y,
          { width: 40 }
        );

        doc.text(
          item.fat.toString(),
          280,
          y,
          { width: 40 }
        );

        doc.text(
          item.snf.toString(),
          340,
          y,
          { width: 40 }
        );

        doc.text(
          Number(item.amount)
            .toFixed(2),
          400,
          y,
          { width: 80 }
        );

        doc.y = y + 20;

      });

      doc.end();

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };
const getMonthlyReport =
  async (req, res) => {

    try {

      const {
        month,
        year,
      } = req.query;

      if (!month || !year) {

        return res.status(400).json({
          message:
            "Month and Year Required",
        });
      }

      const startDate =
        new Date(
          Number(year),
          Number(month) - 1,
          1
        );

      const endDate =
        new Date(
          Number(year),
          Number(month),
          1
        );

      const collections =
        await MilkCollection.find({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        });

      // =====================
      // TOTALS
      // =====================

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

      // =====================
      // MORNING REPORT
      // =====================

      const morningCollections =
        collections.filter(
          (item) =>
            item.shift === "Morning"
        );

      const morningMilk =
        morningCollections.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      const morningAmount =
        morningCollections.reduce(
          (sum, item) =>
            sum + item.amount,
          0
        );

      // =====================
      // EVENING REPORT
      // =====================

      const eveningCollections =
        collections.filter(
          (item) =>
            item.shift === "Evening"
        );

      const eveningMilk =
        eveningCollections.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      const eveningAmount =
        eveningCollections.reduce(
          (sum, item) =>
            sum + item.amount,
          0
        );

      // =====================
      // BEST FARMER
      // =====================

      const topFarmer =
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
          {
            $limit: 1,
          },
        ]);

      let bestFarmer = null;

      if (
        topFarmer.length > 0
      ) {

        const farmer =
          await Farmer.findOne({
            farmerId:
              topFarmer[0]._id,
          });

        bestFarmer = {

          farmerId:
            topFarmer[0]._id,

          farmerName:
            farmer?.name || "",

          village:
            farmer?.village || "",

          totalAmount:
            Number(
              topFarmer[0]
                .totalAmount
            ).toFixed(2),
        };
      }

      // =====================
      // RESPONSE
      // =====================

      res.status(200).json({

        month,
        year,

        totalCollections,

        morningMilk:
          Number(
            morningMilk.toFixed(2)
          ),

        morningAmount:
          Number(
            morningAmount.toFixed(2)
          ),

        eveningMilk:
          Number(
            eveningMilk.toFixed(2)
          ),

        eveningAmount:
          Number(
            eveningAmount.toFixed(2)
          ),

        totalMilk:
          Number(
            totalMilk.toFixed(2)
          ),

        totalAmount:
          Number(
            totalAmount.toFixed(2)
          ),

        bestFarmer,

      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

const downloadMonthlyReport =
  async (req, res) => {

    try {

      const { month, year } =
        req.query;

      const startDate =
        new Date(
          Number(year),
          Number(month) - 1,
          1
        );

      const endDate =
        new Date(
          Number(year),
          Number(month),
          1
        );

      const collections =
        await MilkCollection.find({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        });

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

      const morningCollections =
        collections.filter(
          (item) =>
            item.shift === "Morning"
        );

      const morningMilk =
        morningCollections.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      const morningAmount =
        morningCollections.reduce(
          (sum, item) =>
            sum + item.amount,
          0
        );

      const eveningCollections =
        collections.filter(
          (item) =>
            item.shift === "Evening"
        );

      const eveningMilk =
        eveningCollections.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      const eveningAmount =
        eveningCollections.reduce(
          (sum, item) =>
            sum + item.amount,
          0
        );

      const topFarmer =
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
          {
            $limit: 1,
          },
        ]);

      let bestFarmer = null;

      if (topFarmer.length > 0) {

        const farmer =
          await Farmer.findOne({
            farmerId:
              topFarmer[0]._id,
          });

        bestFarmer = {
          farmerId:
            topFarmer[0]._id,

          farmerName:
            farmer?.name || "",

          village:
            farmer?.village || "",

          totalAmount:
            Number(
              topFarmer[0]
                .totalAmount
            ).toFixed(2),
        };
      }

      const doc =
        new PDFDocument({
          margin: 40,
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=monthly-report-${month}-${year}.pdf`
      );

      doc.pipe(res);

      doc
        .fontSize(20)
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
          "MONTHLY REPORT",
          {
            align: "center",
          }
        );

      doc.moveDown(2);

      doc.text(
        `Month : ${month}/${year}`
      );

      doc.moveDown();

      doc.text(
        `Morning Milk : ${morningMilk.toFixed(2)} L`
      );

      doc.text(
        `Morning Amount : Rs. ${morningAmount.toFixed(2)}`
      );

      doc.moveDown(0.5);

      doc.text(
        `Evening Milk : ${eveningMilk.toFixed(2)} L`
      );

      doc.text(
        `Evening Amount : Rs. ${eveningAmount.toFixed(2)}`
      );

      doc.moveDown(0.5);

      doc.text(
        `Total Collections : ${totalCollections}`
      );

      doc.text(
        `Total Milk : ${totalMilk.toFixed(2)} L`
      );

      doc.text(
        `Total Amount : Rs. ${totalAmount.toFixed(2)}`
      );

      doc.moveDown();

      doc.fontSize(14)
        .text("Best Farmer");

      doc.fontSize(12);

      doc.text(
        `Farmer ID : ${bestFarmer?.farmerId || "-"}`
      );

      doc.text(
        `Name : ${bestFarmer?.farmerName || "-"}`
      );

      doc.text(
        `Village : ${bestFarmer?.village || "-"}`
      );

      doc.text(
        `Revenue : Rs. ${bestFarmer?.totalAmount || "0"}`
      );

      doc.moveDown(2);

      doc.text(
        "Generated By Smart Dairy ERP",
        {
          align: "center",
        }
      );

      doc.end();

    } catch (error) {

      if (!res.headersSent) {
        return res.status(500).json({
          message: error.message,
        });
      }

      console.log(error);
    }
  };

const downloadDateReportPDF =
  async (req, res) => {

    try {

      const { date } =
        req.query;

      if (!date) {
        return res.status(400).json({
          message: "Date Required",
        });
      }

      const startDate =
        new Date(date);

      const endDate =
        new Date(date);

      endDate.setDate(
        endDate.getDate() + 1
      );

      const collections =
        await MilkCollection.find({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        });

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

      const morningCollections =
        collections.filter(
          item =>
            item.shift === "Morning"
        );

      const eveningCollections =
        collections.filter(
          item =>
            item.shift === "Evening"
        );

      const morningMilk =
        morningCollections.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      const morningAmount =
        morningCollections.reduce(
          (sum, item) =>
            sum + item.amount,
          0
        );

      const eveningMilk =
        eveningCollections.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      const eveningAmount =
        eveningCollections.reduce(
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

      const [year, month, day] =
        date.split("-");

      const fileDate =
        `${day}-${month}-${year}`;

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=date-report-${fileDate}.pdf`
      );

      doc.pipe(res);

      doc
        .fontSize(22)
        .text(
          "SMART DAIRY ERP",
          { align: "center" }
        );

      doc.moveDown();

      doc
        .fontSize(18)
        .text(
          "DATE REPORT",
          { align: "center" }
        );

      doc.moveDown(2);

      const formattedDate =
        new Date(date)
          .toLocaleDateString(
            "en-GB"
          );

      doc.text(
        `Date : ${formattedDate}`
      );

      doc.moveDown();

      doc.text(
        `Morning Milk : ${morningMilk.toFixed(2)} L`
      );

      doc.text(
        `Morning Amount : Rs. ${morningAmount.toFixed(2)}`
      );

      doc.moveDown(0.5);

      doc.text(
        `Evening Milk : ${eveningMilk.toFixed(2)} L`
      );

      doc.text(
        `Evening Amount : Rs. ${eveningAmount.toFixed(2)}`
      );

      doc.moveDown();

      doc.text(
        `Total Collections : ${totalCollections}`
      );

      doc.text(
        `Total Milk : ${totalMilk.toFixed(2)} L`
      );

      doc.text(
        `Total Amount : Rs. ${totalAmount.toFixed(2)}`
      );

      doc.moveDown(2);

      doc.text(
        "Generated By Smart Dairy ERP",
        {
          align: "center",
        }
      );

      doc.end();
      return;

    } catch (error) {

      if (!res.headersSent) {
        return res.status(500).json({
          message: error.message,
        });
      }

      console.log(error);
    }
  };

module.exports = {
  getDateReport,
  getFarmerReport,
  getTopFarmers,
  getMonthlyReport,
  downloadFarmerReportPDF,
  downloadMonthlyReport,
  downloadDateReportPDF,
};