const express = require("express");
const Patient = require("../models/Patient");
const router = express.Router();

//get all patients 
//mongoDB se patients leke aayega backend me

router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    }
    catch (error) {

        res.status(500).json({ message: "Error in fetching patients" });
    }
});

//new patient mongoDB me save karne ke liye
router.post("/", async (req, res) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(200).json(patient);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// update patient
router.put("/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.status(200).json(patient);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
router.delete("/:id",async(req,res)=>{
    try{
        const patient = await Patient.findByIdAndDelete(
            req.params.id
        )
        if(!patient){
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        res.status(200).json({
            message: "Patient deleted successfully"
        });
    }
    catch(error){
        res.status(400).json({
            message: error.message
        });
    }
})

module.exports = router;


