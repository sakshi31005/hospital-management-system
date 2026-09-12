const express = require("express");
const Department = require("../models/Department");

const router = express.Router();

// GET all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ADD department
router.post("/", async (req, res) => {
  try {
    const department = new Department(req.body);

    await department.save();

    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE department
router.put("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE department
router.delete("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.status(200).json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;