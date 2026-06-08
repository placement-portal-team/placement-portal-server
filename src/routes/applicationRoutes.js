const express = require("express");
const protect=require("../middleware/authMiddleware");

const router = express.Router();

const {getApplication,createApplication,updateApplicationStage}=require("../controllers/applicationController");
router.get("/",protect,getApplication);
router.post("/",protect,createApplication);
router.patch("/:id/stage",updateApplicationStage);

module.exports = router;

