const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env",
});

const connectDB = require("./config/db");

connectDB();

const authRoutes = require("./routes/authRoutes");
const residentRoutes = require("./routes/residentRoutes");
const flatRoutes = require("./routes/flatRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const eventBookingRoutes = require("./routes/eventBookingRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Test Route
app.get("/", (req, res) => {
  res.send("Apartment Management API Running");
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/flats", flatRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/event-bookings", eventBookingRoutes);


// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});