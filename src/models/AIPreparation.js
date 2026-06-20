const mongoose = require("mongoose");

const aiPreparationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    technicalQuestions: {
      type: Array,
      default: [],
    },
    hrQuestions: {
      type: Array,
      default: [],
    },
    studyRoadmap: {
      type: Object,
      default: {},
    },
    promptVersion: {
      type: String,
      default: "v1.2",
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIPreparation", aiPreparationSchema);