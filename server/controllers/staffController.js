const Staff =
  require("../models/Staff");


// CREATE STAFF

const createStaff =
  async (req, res) => {

    try {

      const {
        name,
        mobile,
        role,
        salary,
      } = req.body;

      const count =
        await Staff.countDocuments();

      const staffId =
        `STF${String(
          count + 1
        ).padStart(3, "0")}`;

      const staff =
        await Staff.create({
          staffId,
          name,
          mobile,
          role,
          salary,
        });

      res.status(201).json(
        staff
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


// GET ALL STAFF

const getAllStaff =
  async (req, res) => {

    try {

      const staff =
        await Staff.find().sort({
          createdAt: -1,
        });

      res.status(200).json(
        staff
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


// GET STAFF BY ID

const getStaffById =
  async (req, res) => {

    try {

      const staff =
        await Staff.findById(
          req.params.id
        );

      if (!staff) {

        return res.status(404).json({
          message:
            "Staff Not Found",
        });

      }

      res.status(200).json(
        staff
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


// UPDATE STAFF

const updateStaff =
  async (req, res) => {

    try {

      const staff =
        await Staff.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json(
        staff
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


// DELETE STAFF

const deleteStaff =
  async (req, res) => {

    try {

      await Staff.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message:
          "Staff Deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
};