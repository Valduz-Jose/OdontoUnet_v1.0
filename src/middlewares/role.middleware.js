import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

export const adminRequired = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) return res.status(401).json({message: "No token, authorization denied"});
    
    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({message:"Invalid Token"});
        
        try {
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({message:"User not found"});
            if (user.role !== "admin") return res.status(403).json({message:"Access denied: Admin only"});
            
            req.user = { id: user._id, role: user.role, username: user.username };
            next();
        } catch (error) {
            return res.status(500).json({message:"Server error"});
        }
    });
};