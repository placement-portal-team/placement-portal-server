const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");

// console.log("hii");

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            college,
            branch,
            graduationYear,
            resumeUrl
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

    //    console.log("hii");

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            branch,
            graduationYear,
            resumeUrl
        });
        
        // console.log("hii");

        // Return safe response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// console.log("hii");

const loginUser = async (req, res) => {
    try{
        const {email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const ismatch=await bcrypt.compare(password,existingUser.password);
        if(!ismatch){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        
        const token=jwt.sign(
            {
            userId:existingUser._id,
            email:existingUser.email
            },process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )
        
            res.status(200).json(
                {
                    success:true,
                    token,
                     user: {
                        id: existingUser._id,
                        name: existingUser.name,
                        email: existingUser.email
                    }
                }
            )
        
    
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                branch: user.branch,
                graduationYear: user.graduationYear,
                resumeUrl: user.resumeUrl
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const updateProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const {name,college,graduationYear,resumeUrl,branch}=req.body;
        user.name = name || user.name;
        user.college = college || user.college;
        user.branch = branch || user.branch;
        user.graduationYear = graduationYear || user.graduationYear;
        user.resumeUrl = resumeUrl || user.resumeUrl;

        await user.save();

        res.status(200).json({
               success: true,
               message: "Profile updated successfully",
               data: {
                   id: user._id,
                   name: user.name,
                   email: user.email,
                   college: user.college,
                   branch: user.branch,
                   graduationYear: user.graduationYear,
                   resumeUrl: user.resumeUrl
               }
});

    } catch(error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const changePassword=async(req,res)=>{
    try{
        const {currentPassword,newPassword}=req.body;
        if (!currentPassword || !newPassword) {
         return res.status(400).json({
            success: false,
            message: "Current password and new password are required"
        });
    }
        if (currentPassword === newPassword) {
         return res.status(400).json({
            success: false,
            message: "New password must be different from current password"
        });
       }


       const user = await User.findById(req.user.userId);
       if (!user) {
         return res.status(404).json({
         success: false,
         message: "User not found"
    });
}
       const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
}

       const hashedPassword = await bcrypt.hash(newPassword,10);

       user.password = hashedPassword;

       await user.save();
       res.status(200).json({
       success: true,
       message: "Password changed successfully"
});

   }
    catch(err){
      res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    registerUser,loginUser,getProfile,updateProfile,changePassword
};