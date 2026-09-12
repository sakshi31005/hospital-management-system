const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/AuthRoutes");

const patientRoutes = require("./routes/PatientRoutes");
const doctorRoutes = require("./routes/DoctorRoutes");
const appointmentRoutes = require("./routes/AppointmentRoutes");
const departmentRoutes = require("./routes/DepartmentRoutes");
const prescriptionRoutes = require("./routes/PrescriptionRoutes");
const billRoutes = require("./routes/BillsRoutes");
const bedRoutes = require("./routes/BedRoutes");
const labRoutes = require("./routes/LabReportsRoutes");
const availabilityRoutes = require("./routes/DoctorAvailabilityRoutes");
const medicalRoutes = require("./routes/MedicalRecordsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/lab-reports", labRoutes);
app.use("/api/doctor-availability", availabilityRoutes);
app.use("/api/medical-records", medicalRoutes);

app.get("/", (req, res) => {
    res.send("hospital management system backend is running!");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log("MongoDB connection failed", err.message);
});
