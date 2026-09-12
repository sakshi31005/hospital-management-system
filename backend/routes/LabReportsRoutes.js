const express = require("express");
const LabReport = require("../models/LabReports");

const router = express.Router();

// GET all lab reports
router.get("/", async (req, res) => {
    try {
        const reports = await LabReport.find().sort({ reportDate: -1 });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// GET lab reports for a specific patient
router.get("/patient/:patientId", async (req, res) => {
    try {
        const reports = await LabReport.find({
            patientId: req.params.patientId,
        }).sort({ reportDate: -1 });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// GET single lab report
router.get("/:id", async (req, res) => {
    try {
        const report = await LabReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: "Lab report not found",
            });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// CREATE lab report
router.post("/", async (req, res) => {
    try {
        const report = new LabReport(req.body);

        await report.save();

        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

// UPDATE lab report
router.put("/:id", async (req, res) => {
    try {
        const report = await LabReport.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!report) {
            return res.status(404).json({
                message: "Lab report not found",
            });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

// DELETE lab report
router.delete("/:id", async (req, res) => {
    try {
        const report = await LabReport.findByIdAndDelete(
            req.params.id
        );

        if (!report) {
            return res.status(404).json({
                message: "Lab report not found",
            });
        }

        res.status(200).json({
            message: "Lab report deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;