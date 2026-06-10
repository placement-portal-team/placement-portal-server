const express = require("express");
const protect=require("../middleware/authMiddleware");

const router = express.Router();

const {getApplication,createApplication,updateApplicationStage,getApplicationStats}=require("../controllers/applicationController");
router.get("/stats",protect,getApplicationStats);
router.get("/",protect,getApplication);
router.post("/",protect,createApplication);
router.patch("/:id/stage",protect,updateApplicationStage);

module.exports = router;

