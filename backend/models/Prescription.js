const mongoose = require("mongoose");
const PrescriptionSchema = new mongoose.Schema({

    doctorId: {
        type: String,
        required: true
    },

    patientId: {
        type: String,
        required: true
    },

    appointmentId: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    diagnosis: {
        type: String,
        required: true
    },

    medications: [
        {
            name: String,
            dosage: String,
            frequency: String,
            duration: String
        }
    ],

    instructions: {
        type: String
    },

    followUp: {
        type: Date
    }

})
const Prescription = mongoose.model("Prescription", PrescriptionSchema);
module.exports = Prescription;