const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// CREATE appointment
router.post("/", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// GET all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET single appointment
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE appointment
router.put("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE appointment
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;