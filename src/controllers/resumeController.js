const { PDFParse } = require("pdf-parse");
const Resume = require("../models/resume");

const uploadResume = async (req, res) => {
  let parser;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required"
      });
    }

    parser = new PDFParse({
      data: req.file.buffer
    });

    const result = await parser.getText();

    const extractedText = result.text?.trim();

    if (!extractedText || extractedText.length < 50) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract sufficient text from resume"
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        userId: req.user.userId
      },
      {
        originalFileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        extractedText,
        uploadedAt: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: {
        id: resume._id,
        originalFileName: resume.originalFileName,
        fileSize: resume.fileSize,
        uploadedAt: resume.uploadedAt
      }
    });

  } catch (error) {
    console.error(
      "[Resume Upload Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to process resume"
    });

  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: resume._id,
        originalFileName: resume.originalFileName,
        mimeType: resume.mimeType,
        fileSize: resume.fileSize,
        uploadedAt: resume.uploadedAt
      }
    });

  } catch (error) {
    console.error(
      "[Get Resume Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume"
    });
  }
};


const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      userId: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully"
    });

  } catch (error) {
    console.error(
      "[Delete Resume Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume"
    });
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume
};