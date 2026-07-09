const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

const Application = require("../models/applications");
const AIPreparation = require("../models/AIPreparation");
const geminiService = require("../../services/geminiService");
const geminiServiceInstance = require("../../services/geminiService");

router.post("/prepare", protect, async (req, res) => {
  try {
    const { applicationId, jdText, resumeText } = req.body;

    if (!applicationId || !jdText) {
      return res.status(400).json({
        success: false,
        message: "applicationId and jdText are required",
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

    // Ownership check
    if (application.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this application",
      });
    }

    const result = await geminiService.generatePrep({
      role: application.role,
      company: application.companyName,
      jobDescription: jdText,
      skills: [], // no skills field on User yet — defaulting to empty array
      resumeText: resumeText || "",
    });

    const saved = await AIPreparation.create({
      userId: req.user.userId,
      applicationId: application._id,
      companyName: application.companyName,
      role: application.role,
      technicalQuestions: result.technicalQuestions,
      hrQuestions: result.hrQuestions,
      studyRoadmap: result.studyRoadmap,
      promptVersion: result.promptVersion,
      generatedAt: result.generatedAt,
    });
    

    return res.status(201).json({
      success: true,
      message: "AI preparation generated successfully",
      data: saved,
    });
  } catch (error) {
    console.error("[AI Prepare Error]", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI preparation",
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
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    if (application.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const existing = await AIPreparation.findOne({ applicationId }).sort({ createdAt: -1 });

    if (!existing) {
      return res.json({ success: true, data: { exists: false } });
    }

    const isStale = geminiServiceInstance.isStale(existing.promptVersion);

    return res.json({
      success: true,
      data: {
        exists: true,
        isStale,
        promptVersion: existing.promptVersion,
        result: {
          technicalQuestions: existing.technicalQuestions,
          hrQuestions: existing.hrQuestions,
          studyRoadmap: existing.studyRoadmap,
          generatedAt: existing.generatedAt,
        },
      },
    });
  } catch (error) {
    console.error("[AI History Error]", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch AI history" });
  }
});

module.exports = router;