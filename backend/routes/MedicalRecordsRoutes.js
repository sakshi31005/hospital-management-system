const express = require("express");
const MedicalRecord = require("../models/MedicalRecord");

const router = express.Router();

// Get all medical records
router.get("/", async (req, res) => {
  try {
    const records = await MedicalRecord.find().sort({
      recordDate: -1,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch medical records",
      error: error.message,
    });
  }
});

// Get records of one patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      patientId: req.params.patientId,
    }).sort({
      recordDate: -1,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patient medical records",
      error: error.message,
    });
  }
});

// Create medical record
router.post("/", async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);

    const savedRecord = await record.save();

    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create medical record",
      error: error.message,
    });
  }
});

// Update medical record
router.put("/:id", async (req, res) => {
  try {
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRecord) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update medical record",
      error: error.message,
    });
  }
});

// Delete medical record
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecord =
      await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    res.json({
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete medical record",
      error: error.message,
    });
  }
});

module.exports = router;