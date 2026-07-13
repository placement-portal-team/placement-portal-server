const express = require("express");
const protect=require("../middleware/authMiddleware");

const router = express.Router();

const {getApplication,createApplication,updateApplicationStage,getApplicationStats,deleteApplication,getApplicationAnalytics,updateApplicationEvent,getApplicationDetails,updateApplicationDetails}=require("../controllers/applicationController");
router.get("/stats",protect,getApplicationStats);
router.get("/analytics",protect,getApplicationAnalytics);

router.get("/",protect,getApplication);
router.post("/",protect,createApplication);
router.get("/:id", protect, getApplicationDetails);
router.patch("/:id", protect,updateApplicationDetails);
router.patch("/:id/stage",protect,updateApplicationStage);
router.delete("/:id", protect, deleteApplication);
router.patch("/:id/event",protect, updateApplicationEvent);

module.exports = router;

