const express = require("express");
const Prescription = require("../models/Prescription");
const router = express.Router();

//create prescription
router.post("/", async (req, res) => {
    try {
        const prescription = await Prescription.create(req.body);
        res.status(200).json(prescription);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//get all prescriptions
router.get("/", async (req, res) => {
    try {
        const prescriptions = await Prescription.find();
        res.status(200).json(prescriptions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get single prescription
router.get("/:id", async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        res.status(200).json(prescription);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//update prescription
router.put("/:id", async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(prescription);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete prescription
router.delete("/:id", async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Prescription deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;