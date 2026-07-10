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

    mode: {
      type: String,
      enum: ["stage", "full"],
      required: true,
      default: "stage",
    },

    agentType: {
      type: String,
      enum: ["roadmap", "oa", "technical", "hr", "full"],
      required: true,
    },

    stage: {
      type: String,
      default: null,
    },

    usedFallback: {
      type: mongoose.Schema.Types.Mixed,
      default: false,
    },

    technicalQuestions: {
      type: Array,
      default: [],
    },
    technicalFocusTopics: {
  type: Array,
  default: []
},

interviewStrategy: {
  type: Array,
  default: []
},


    hrQuestions: {
      type: Array,
      default: [],
    },
    hrStrategy: {
  type: Array,
  default: []
},

    studyRoadmap: {
      type: Object,
      default: {},
    },

    oaPreparation: {
      practiceQuestions: {
        type: Array,
        default: [],
      },

      focusTopics: {
        type: Array,
        default: [],
      },

      oaStrategy: {
        type: Array,
        default: [],
      },
    
    },
      urgencyBucket: {
  type: String,
  enum: [
    "crash",
    "compressed",
    "focused",
    "broad",
    "normal",
    "none"
  ],
  default: "none"
},



    promptVersion: {
      type: String,
      default: "v1.4",
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

module.exports = mongoose.model(
  "AIPreparation",
  aiPreparationSchema
);