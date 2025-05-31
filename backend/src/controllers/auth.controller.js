import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";



export async function signup(req,res) {

const { email,password,fullName} = req.body;

try {

    if(!email || !password || !fullName) {
        return res.status(400).json({message: "Please fill all the fields"});
    }

    if(password.length < 6) {
        return res.status(400).json({message: "Password must be at least 6 characters long"});
    }

    // john@gmail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({message: "Email ALready exists, please use a different one"});
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
        email,
        password,
        fullName,
        profilePic: randomAvatar
    });

    try {
        await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic,
        });
        console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
        console.log("Error creating Stream user:", error);
        
    }




    const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production" // Set to true in production
    });

    res.status(201).json({success:true, user:newUser});

}catch(error){
    console.log ("Error in signup controller", error);
    res.status(500).json({message: "Internal Server Error"});
}
}

export async function login(req,res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Invalid Email or Password" });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Email or Password" });
        
            const token = jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production" // Set to true in production
    });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export function logout(req,res) {
    res.clearCookie("jwt")
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location } = req.body;


        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ 
                message: "All field are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean)
            });
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            await upsertStreamUser({
            id: updateUser._id.toString(),
            name: updateUser.fullName,
            image: updateUser.profilePic,
        });
            console.log(`Stream user updated after onboarding for ${updateUser.fullName}`);
        } catch (streamEror) {
            console.log("Error updating Stream user:", streamError.message);
            
        }
        

        res.status(200).json({ success: true, user: updateUser });
    } catch (error) {
        console.error("Onboarding error", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}