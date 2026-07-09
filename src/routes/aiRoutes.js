const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

const Application = require("../models/applications");
const AIPreparation = require("../models/AIPreparation");
const geminiService = require("../../services/geminiService");
const Resume = require("../models/Resume");


router.post("/prepare", protect, async (req, res) => {
  try {
    const {applicationId,mode = "stage"} = req.body;
    const resume = await Resume.findOne({
       userId: req.user.userId
    });

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "applicationId is required",
      });
    }

    if (!["stage", "full"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "mode must be either stage or full",
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      deletedAt: null,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      application.userId.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this application",
      });
    }

    if (!application.jobDescription) {
      return res.status(400).json({
        success: false,
        message:
          "Job description is required for AI preparation",
      });
    }

    const result = await geminiService.generatePrep({
      role: application.role,
      company: application.companyName,
      jobDescription: application.jobDescription,
      skills: [],
       resumeText: resume?.extractedText || "",
      currentStage: application.currentStage,
      mode,
    });

    const saved = await AIPreparation.create({
      userId: req.user.userId,
      applicationId: application._id,
      companyName: application.companyName,
      role: application.role,

      mode,
      agentType: result.agentType,
      stage:
        mode === "stage"
          ? application.currentStage
          : null,

      usedFallback: result.usedFallback,

      technicalQuestions:
        result.technicalQuestions || [],

      hrQuestions:
        result.hrQuestions || [],

      studyRoadmap:
        result.studyRoadmap || {},

      oaPreparation: {
        practiceQuestions:
          result.practiceQuestions ||
          result.oaPreparation?.practiceQuestions ||
          [],

        focusTopics:
          result.focusTopics ||
          result.oaPreparation?.focusTopics ||
          [],

        oaStrategy:
          result.oaStrategy ||
          result.oaPreparation?.oaStrategy ||
          [],
      },

      promptVersion: result.promptVersion,
      generatedAt: result.generatedAt,
    });

    return res.status(201).json({
      success: true,
      message:
        mode === "stage"
          ? `${result.agentType} preparation generated for ${application.currentStage} stage`
          : "Complete AI preparation generated successfully",
      data: saved,
    });
  } catch (error) {
    console.error(
      "[AI Prepare Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI preparation",
    });
  }
});
router.get("/history/:applicationId/all", protect, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      deletedAt: null,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      application.userId.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const preparations = await AIPreparation.find({
      applicationId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: preparations.length,
      application: {
        id: application._id,
        companyName: application.companyName,
        role: application.role,
        currentStage: application.currentStage,
      },
      data: preparations,
    });

  } catch (error) {
    console.error(
      "[AI All History Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI preparation history",
    });
  }
});

router.get("/history/:applicationId", protect, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      deletedAt: null,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      application.userId.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const existing = await AIPreparation.findOne({
      applicationId,
    }).sort({ createdAt: -1 });

    if (!existing) {
      return res.json({
        success: true,
        data: {
          exists: false,
        },
      });
    }

    const isStale = geminiService.isStale(
      existing.promptVersion
    );

    return res.status(200).json({
      success: true,
      data: {
        exists: true,
        isStale,

        preparationId: existing._id,
        promptVersion: existing.promptVersion,
        mode: existing.mode,
        agentType: existing.agentType,
        stage: existing.stage,
        usedFallback: existing.usedFallback,

        result: {
          technicalQuestions:
            existing.technicalQuestions,

          hrQuestions:
            existing.hrQuestions,

          studyRoadmap:
            existing.studyRoadmap,

          oaPreparation:
            existing.oaPreparation,

          generatedAt:
            existing.generatedAt,
        },
      },
    });

  } catch (error) {
    console.error(
      "[AI History Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI history",
    });
  }
});

module.exports = router;