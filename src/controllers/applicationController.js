const Application=require("../models/applications");


const createApplication = async (req, res) => {
    try {
        const initialStage = req.body.currentStage || "Applied";

        const application = await Application.create({
            ...req.body,
            userId: req.user.userId,
            statusHistory: [
                {
                    status: initialStage
                }
            ]
        });

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
};
const getApplication = async (req, res) => {
    try {
        const userId = req.user.userId;
       const { stage, company, sort, page = 1, limit = 10 } = req.query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const skip = (pageNumber - 1) * limitNumber;

        const query = {
            userId,
            deletedAt: null
        };

        if (stage) {
            query.currentStage = stage;
        }

        if (company) {
            query.companyName = {
                $regex: company,
                $options: "i"
            };
        }

        let sortOptions = { appliedDate: -1 };

        if (sort === "oldest") {
            sortOptions = { appliedDate: 1 };
        }

        if (sort === "company") {
            sortOptions = { companyName: 1 };
        }

       const totalApplications = await Application.countDocuments(query);

       const applications = await Application.find(query)
           .sort(sortOptions)
           .skip(skip)
           .limit(limitNumber);

        const totalPages = Math.ceil(
            totalApplications / limitNumber
        );

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getApplicationStats = async (req, res) => {
    try {

        const applications = await Application.find({
            userId: req.user.userId,deletedAt: null
        });

        const stats = {
            Applied: 0,
            "OA Scheduled": 0,
            "OA Cleared": 0,
            "Technical Interview": 0,
            "HR Interview": 0,
            Offered: 0,
            Rejected: 0
        };

        const groupedApplications = {
            Applied: [],
            "OA Scheduled": [],
            "OA Cleared": [],
            "Technical Interview": [],
            "HR Interview": [],
            Offered: [],
            Rejected: []
        };

        for (const application of applications) {

            stats[application.currentStage]++;

            groupedApplications[application.currentStage].push({
                id: application._id,
                companyName: application.companyName,
                role: application.role
            });
        }

        res.status(200).json({
            success: true,
            data: {
                summary: stats,
                totalApplications: applications.length,
                groupedApplications
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const updateApplicationStage = async (req, res) => {
    try {

        const { id } = req.params;
        const { currentStage } = req.body;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (application.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }
        if (application.currentStage === currentStage) {
    return res.status(400).json({
        success: false,
        message: `Application is already at ${currentStage} stage`
    });
}

application.currentStage = currentStage;

application.statusHistory.push({
    status: currentStage
});

await application.save();
        res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const deleteApplication = async (req, res) => {
    try {

        const { id } = req.params;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }
        if (application.deletedAt !== null) {
    return res.status(400).json({
        success: false,
        message: "Application is already deleted"
    });
}

        if (application.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        application.deletedAt = new Date();
        await application.save();

        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getApplication,createApplication,updateApplicationStage,getApplicationStats,deleteApplication,
};