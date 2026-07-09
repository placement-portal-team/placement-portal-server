const express = require("express");

const protect = require("../middleware/authMiddleware");
const uploadResume = require("../middleware/resumeUpload");
const {
  uploadResume: uploadResumeController,getResume,deleteResume
} = require("../controllers/resumeController");

const router = express.Router();

router.post(
  "/upload",
  protect,
  uploadResume.single("resume"),
  uploadResumeController
);
router.get( "/",protect,getResume);

router.delete(  "/", protect,deleteResume);

module.exports = router;