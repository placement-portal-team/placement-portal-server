const Application=require("../models/applications");
const mongoose = require("mongoose");


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
const getApplicationAnalytics = async (req, res) => {
    try {
        const applications = await Application.find({
            userId: req.user.userId,
            deletedAt: null
        });

        // =========================
        // OVERVIEW ANALYTICS
        // =========================

        const totalApplications = applications.length;

        const offers = applications.filter(
            application =>
                application.currentStage === "Offered"
        ).length;

        const rejections = applications.filter(
            application =>
                application.currentStage === "Rejected"
        ).length;

        const activeApplications =
            totalApplications - offers - rejections;

        const offerRate =
            totalApplications === 0
                ? 0
                : Number(
                    (
                        (offers / totalApplications) *
                        100
                    ).toFixed(2)
                );

        const rejectionRate =
            totalApplications === 0
                ? 0
                : Number(
                    (
                        (rejections / totalApplications) *
                        100
                    ).toFixed(2)
                );


        // =========================
        // STAGE DISTRIBUTION
        // =========================

        const stageDistribution = {
            Applied: 0,
            "OA Scheduled": 0,
            "OA Cleared": 0,
            "Technical Interview": 0,
            "HR Interview": 0,
            Offered: 0,
            Rejected: 0
        };


        // =========================
        // SOURCE DISTRIBUTION
        // =========================

        const sourceDistribution = {};


        for (const application of applications) {

            if (
                Object.prototype.hasOwnProperty.call(
                    stageDistribution,
                    application.currentStage
                )
            ) {
                stageDistribution[
                    application.currentStage
                ]++;
            }

            const source = application.source;

            if (source) {
                sourceDistribution[source] =
                    (
                        sourceDistribution[source] ||
                        0
                    ) + 1;
            }
        }


        // =========================
        // MONTHLY APPLICATION TREND
        // =========================

        const monthlyTrendMap = {};

        for (const application of applications) {

            const date = application.appliedDate;

            if (!date) {
                continue;
            }

            const month = date
                .toISOString()
                .slice(0, 7);

            monthlyTrendMap[month] =
                (monthlyTrendMap[month] || 0) + 1;
        }

        const monthlyApplicationTrend =
            Object.entries(monthlyTrendMap)
                .map(
                    ([month, applications]) => ({
                        month,
                        applications
                    })
                )
                .sort((a, b) =>
                    a.month.localeCompare(b.month)
                );


        // =========================
        // STAGE CONVERSION ANALYTICS
        // =========================

        const stageOrder = [
            "Applied",
            "OA Scheduled",
            "OA Cleared",
            "Technical Interview",
            "HR Interview",
            "Offered"
        ];

        const reachedStage = (
            application,
            targetStage
        ) => {

            const targetIndex =
                stageOrder.indexOf(targetStage);

            if (targetIndex === -1) {
                return false;
            }

            const stagesReached = [
                application.currentStage,
                ...(application.statusHistory || [])
                    .map(
                        history => history.status
                    )
            ];

            return stagesReached.some(stage => {

                const stageIndex =
                    stageOrder.indexOf(stage);

                return (
                    stageIndex !== -1 &&
                    stageIndex >= targetIndex
                );
            });
        };


        let reachedOA = 0;
        let clearedOA = 0;
        let reachedTechnical = 0;
        let reachedHR = 0;
        let reachedOffer = 0;


        for (const application of applications) {

            if (
                reachedStage(
                    application,
                    "OA Scheduled"
                )
            ) {
                reachedOA++;
            }

            if (
                reachedStage(
                    application,
                    "OA Cleared"
                )
            ) {
                clearedOA++;
            }

            if (
                reachedStage(
                    application,
                    "Technical Interview"
                )
            ) {
                reachedTechnical++;
            }

            if (
                reachedStage(
                    application,
                    "HR Interview"
                )
            ) {
                reachedHR++;
            }

            if (
                reachedStage(
                    application,
                    "Offered"
                )
            ) {
                reachedOffer++;
            }
        }


        // =========================
        // PERCENTAGE HELPER
        // =========================

        const calculateRate = (
            value,
            total
        ) => {

            if (total === 0) {
                return 0;
            }

            return Number(
                (
                    (value / total) *
                    100
                ).toFixed(2)
            );
        };


        // =========================
        // CONVERSION RATES
        // =========================

        const conversionRates = {

            appliedToOA: calculateRate(
                reachedOA,
                totalApplications
            ),

            oaScheduledToCleared:
                calculateRate(
                    clearedOA,
                    reachedOA
                ),

            oaClearedToTechnical:
                calculateRate(
                    reachedTechnical,
                    clearedOA
                ),

            technicalToHR:
                calculateRate(
                    reachedHR,
                    reachedTechnical
                ),

            hrToOffer:
                calculateRate(
                    reachedOffer,
                    reachedHR
                )
        };


        // =========================
        // RESPONSE
        // =========================

        return res.status(200).json({
            success: true,

            data: {

                overview: {
                    totalApplications,
                    activeApplications,
                    offers,
                    rejections,
                    offerRate,
                    rejectionRate
                },

                stageDistribution,

                sourceDistribution,

                monthlyApplicationTrend,

                conversionRates
            }
        });

    } catch (error) {

        console.error(
            "[Application Analytics Error]",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch application analytics"
        });
    }
};

const updateApplicationStage = async (req, res) => {
    try {

        const { id } = req.params;
 
        const { currentStage } = req.body;
               const validStages = [
  "Applied",
  "OA Scheduled",
  "OA Cleared",
  "Technical Interview",
  "HR Interview",
  "Offered",
  "Rejected",
];

if (!currentStage) {
  return res.status(400).json({
    success: false,
    message: "currentStage is required",
  });
}

if (!validStages.includes(currentStage)) {
  return res.status(400).json({
    success: false,
    message: "Invalid application stage",
  });
}
        if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid application ID",
  });
}

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid application ID",
  });
}

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
const updateApplicationEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid application ID",
  });
}

        const {
            nextEventType,
            nextEventDate
        } = req.body;

       if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    if (!nextEventType || !nextEventDate) {
      return res.status(400).json({
        success: false,
        message:
          "nextEventType and nextEventDate are required",
      });
    }

    const parsedEventDate = new Date(nextEventDate);

    if (Number.isNaN(parsedEventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date",
      });
    }

    const application = await Application.findOne({
      _id: id,
      userId: req.user.userId,
      deletedAt: null,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.nextEventType = nextEventType.trim();
    application.nextEventDate = parsedEventDate;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Upcoming event updated successfully",
      data: application,
    });
  } catch (error) {
    console.error(
      "[Update Upcoming Event Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update upcoming event",
    });
  }
};
const getApplicationDetails=async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid application ID",
  });
}

    const application = await Application.findOne({
      _id: id,
      userId: req.user.userId,
      deletedAt: null,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "[Get Application Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
    });
  }
}
const updateApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid application ID",
  });
}

    const allowedFields = [
      "companyName",
      "role",
      "source",
      "jobDescription",
      "notes",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    const validSources = [
  "oncampus",
  "linkedin",
  "indeed",
  "glassdoor",
  "referral",
  "companywebsite","whatsapp","instagram","telegram",
  "other",
];

if (updates.source) {
  updates.source = updates.source
    .trim()
    .toLowerCase();

  if (!validSources.includes(updates.source)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application source",
    });
  }
}

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const application = await Application.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      },
      {
        $set: updates,
      },
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

    return res.status(200).json({
      success: true,
      message: "Application details updated successfully",
      data: application,
    });
  } catch (error) {
    console.error(
      "[Update Application Details Error]",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update application details",
    });
  }
};

module.exports = {
    getApplication,createApplication,updateApplicationStage,getApplicationStats,deleteApplication,getApplicationAnalytics,updateApplicationEvent,getApplicationDetails,updateApplicationDetails,
};