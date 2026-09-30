const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const milkRoutes =
  require("./routes/milkRoutes");

const settingsRoutes =
  require("./routes/settingsRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const ledgerRoutes =
  require("./routes/ledgerRoutes");

const paymentRoutes =
  require("./routes/paymentRoutes");

const reportRoutes =
  require("./routes/reportRoutes");

const staffRoutes =
  require("./routes/staffRoutes");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/farmers", farmerRoutes);

app.use("/api/milk", milkRoutes);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/ledger",
  ledgerRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/staff",
  staffRoutes
);

app.get("/", (req, res) => {
  res.send("Dairy ERP Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});