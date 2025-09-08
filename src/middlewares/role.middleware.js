import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const adminRequired = (req,res,next)=>{
    const {token} = req.cookies;
    if(!token) return res.status(401).json({message: "No token, authorization denied"})
    jwt.verify(token, TOKEN_SECRET, async (err,user)=>{
        if(err) return res.status(403).json({message:"Invalid Token"});
        if(user.role !== "admin") return res.status(403).json({message:"Access denied: Admin only"});
        req.user = user;
        next();
    })
}

