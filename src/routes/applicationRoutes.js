const express = require("express");
const protect=require("../middleware/authMiddleware");

const router = express.Router();

const {getApplication,createApplication,updateApplicationStage,getApplicationStats,deleteApplication,getApplicationAnalytics}=require("../controllers/applicationController");
router.get("/stats",protect,getApplicationStats);
router.get("/analytics",protect,getApplicationAnalytics);

router.get("/",protect,getApplication);
router.post("/",protect,createApplication);
router.patch("/:id/stage",protect,updateApplicationStage);
router.delete("/:id", protect, deleteApplication);

module.exports = router;

