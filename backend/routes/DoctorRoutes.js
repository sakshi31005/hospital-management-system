const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// GET all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
});

// GET single doctor
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({
      message: "Failed to fetch doctor",
    });
  }
});

// POST create doctor
router.post("/", async (req, res) => {
  try {
    const doctor = new Doctor(req.body);

    const savedDoctor = await doctor.save();

    res.status(201).json(savedDoctor);
  } catch (error) {
    console.error("Error creating doctor:", error);

    res.status(500).json({
      message: "Failed to create doctor",
      error: error.message,
    });
  }
});

// PUT update doctor
router.put("/:id", async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(updatedDoctor);
  } catch (error) {
    console.error("Error updating doctor:", error);

    res.status(500).json({
      message: "Failed to update doctor",
      error: error.message,
    });
  }
});

// DELETE doctor
router.delete("/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      message: "Doctor deleted successfully",
      doctor: deletedDoctor,
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);

    res.status(500).json({
      message: "Failed to delete doctor",
    });
  }
});

module.exports = router;