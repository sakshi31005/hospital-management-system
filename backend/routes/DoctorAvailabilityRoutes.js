const express = require("express");
const router = express.Router();

const Availability = require("../models/DoctorAvailability");

// GET all availability
router.get("/", async (req, res) => {
  try {
    const availability = await Availability.find().sort({
      day: 1,
      startTime: 1,
    });

    res.json(availability);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch availability",
      error: error.message,
    });
  }
});

// GET availability for one doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const availability = await Availability.find({
      doctorId: req.params.doctorId,
    }).sort({
      day: 1,
      startTime: 1,
    });

    res.json(availability);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor availability",
      error: error.message,
    });
  }
});

// CREATE availability
router.post("/", async (req, res) => {
  try {
    const availability = new Availability(req.body);

    const savedAvailability = await availability.save();

    res.status(201).json(savedAvailability);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create availability",
      error: error.message,
    });
  }
});

// UPDATE availability
router.put("/:id", async (req, res) => {
  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAvailability) {
      return res.status(404).json({
        message: "Availability not found",
      });
    }

    res.json(updatedAvailability);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update availability",
      error: error.message,
    });
  }
});

// DELETE availability
router.delete("/:id", async (req, res) => {
  try {
    const deletedAvailability = await Availability.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAvailability) {
      return res.status(404).json({
        message: "Availability not found",
      });
    }

    res.json({
      message: "Availability deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete availability",
      error: error.message,
    });
  }
});

module.exports = router;