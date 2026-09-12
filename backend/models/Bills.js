const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
    },

    patientName: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    items: [
      {
        description: {
          type: String,
          required: true,
        },

        amount: {
          type: Number,
          required: true,
        },
      },
    ],

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;