const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    currentStage: {
      type: String,
      required: true,
      enum: [
        "Applied",
        "OA Scheduled",
        "OA Cleared",
        "Technical Interview",
        "HR Interview",
        "Offered",
        "Rejected",
      ],
      default: "Applied",
    },
    statusHistory: [
  {
    status: {
      type: String,
      required: true,
      enum: [
        "Applied",
        "OA Scheduled",
        "OA Cleared",
        "Technical Interview",
        "HR Interview",
        "Offered",
        "Rejected",
      ],
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    jobDescription: {
      type: String,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);