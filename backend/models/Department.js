const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: "🏥",
        },
        color: {
            type: String,
            default: "#3B82F6",
        },
    },
    { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;