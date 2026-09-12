const express = require("express");
const User = require("../models/Users");
const Patient = require("../models/patient");
const Doctor = require("../models/Doctor");

const router = express.Router();

// ===============================
// REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      gender,
      address,
      phone,
      bloodGroup,
      department,
      specialization,
      experience,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const userEmail = email.toLowerCase().trim();

    const allowedRoles = [
      "admin",
      "doctor",
      "receptionist",
      "patient",
    ];

    const userRole = role || "patient";

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email: userEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    let patientId = null;
    let doctorId = null;

    // ===============================
    // ADMIN
    // ===============================
    if (userRole === "admin") {
      const existingAdmin = await User.findOne({
        role: "admin",
      });

      if (existingAdmin) {
        return res.status(400).json({
          message:
            "Admin account already exists. Only one admin account is allowed.",
        });
      }
    }

    // ===============================
    // PATIENT
    // ===============================
    if (userRole === "patient") {
      if (
        !age ||
        !gender ||
        !address ||
        !phone ||
        !bloodGroup
      ) {
        return res.status(400).json({
          message: "All patient details are required",
        });
      }

      const existingPatient = await Patient.findOne({
        email: userEmail,
      });

      if (existingPatient) {
        patientId = existingPatient._id.toString();
      } else {
        const patient = await Patient.create({
          name: name.trim(),
          age: Number(age),
          gender,
          address,
          phone,
          email: userEmail,
          bloodGroup,
          status: "active",
        });

        patientId = patient._id.toString();
      }
    }

    // ===============================
    // DOCTOR
    // ===============================
    if (userRole === "doctor") {
      if (
        !department ||
        !specialization ||
        !experience ||
        !phone
      ) {
        return res.status(400).json({
          message: "All doctor details are required",
        });
      }

      const existingDoctor = await Doctor.findOne({
        email: userEmail,
      });

      if (existingDoctor) {
        doctorId = existingDoctor._id.toString();
      } else {
        const doctor = await Doctor.create({
          name: name.trim(),
          email: userEmail,
          department,
          specialization,
          experience: Number(experience),
          phone,
          status: "active",
        });

        doctorId = doctor._id.toString();
      }
    }

    // ===============================
    // CREATE USER
    // ===============================
    const user = await User.create({
      name: name.trim(),
      email: userEmail,
      password,
      role: userRole,
      patientId,
      doctorId,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: user.doctorId,
        patientId: user.patientId,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const userEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: userEmail,
      password: password,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Link patient profile
    if (user.role === "patient" && !user.patientId) {
      const patient = await Patient.findOne({
        email: userEmail,
      });

      if (patient) {
        user.patientId = patient._id.toString();
        await user.save();
      }
    }

    // Link doctor profile
    if (user.role === "doctor" && !user.doctorId) {
      const doctor = await Doctor.findOne({
        email: userEmail,
      });

      if (doctor) {
        user.doctorId = doctor._id.toString();
        await user.save();
      }
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: user.doctorId,
        patientId: user.patientId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;