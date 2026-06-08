const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");

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
            },process.env.JWT_SECRETKEY,
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

module.exports = {
    registerUser,loginUser,
};