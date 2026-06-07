const express = require("express");

const router = express.Router();

const {getApplication,createApplication,updateApplicationStage}=require("../controllers/applicationController");
router.get("/",getApplication);
router.post("/",createApplication);
router.patch("/:id/stage",updateApplicationStage);

module.exports = router;

