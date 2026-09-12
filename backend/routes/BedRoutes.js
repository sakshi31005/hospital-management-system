const express = require("express");
const Bed = require("../models/Bed");

const router = express.Router();

// GET all beds
router.get("/", async (req, res) => {
  try {
    const beds = await Bed.find().sort({ number: 1 });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET single bed
router.get("/:id", async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);

    if (!bed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    res.status(200).json(bed);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE bed
router.post("/", async (req, res) => {
  try {
    const bed = new Bed(req.body);
    await bed.save();

    res.status(201).json(bed);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE bed
router.put("/:id", async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    res.status(200).json(bed);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE bed
router.delete("/:id", async (req, res) => {
  try {
    const bed = await Bed.findByIdAndDelete(req.params.id);

    if (!bed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    res.status(200).json({
      message: "Bed deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;