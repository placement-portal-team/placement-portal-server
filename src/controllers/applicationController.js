const Application=require("../models/applications");

const createApplication=async (req,res)=>{
    try{
        const application=await Application.create(req.body);

        res.status(201).json({
            success: true,
            data: application,
        });
         } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}
const getApplication=async(req,res)=>{
    try{
        const {userId}=req.query;
        const applications=await Application.find({userId});
         res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
    }
    catch(error){
         res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
    }
}
const updateApplicationStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStage } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { currentStage },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
    getApplication,createApplication,updateApplicationStage,
};