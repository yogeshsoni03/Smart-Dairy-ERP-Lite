const express = require("express");
const {
  register,
  updateUser,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.put("/update/:id", updateUser);
router.post("/login", login);

module.exports = router;