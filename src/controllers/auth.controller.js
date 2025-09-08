import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import {createAccessToken} from '../libs/jwt.js'
import jwt from 'jsonwebtoken'
import {ADMIN_CREATION_KEY, TOKEN_SECRET} from '../config.js'

export const register = async (req,res)=>{
    const{email,password,username} = req.body

    try {

        const userFound = await User.findOne({email})
        if (userFound) return res.status(400).json(["The Email is already in use"]);

        const passwordHash = await bcrypt.hash(password,10)//encriptar
        const newUser = new User({
        username,
        email,
        password: passwordHash,//encriptando la contrasena
        role: "odontologo"//forzamos aqui
    })
    // console.log(newUser);
    const userSaved = await newUser.save()
    const token = await createAccessToken ({id:userSaved._id});
    res.cookie('token',token);
    res.json({
        id: userSaved.id,
        username: userSaved.username,
        email :userSaved.email,
        role:userSaved.role,//envio rol
        createdAt :userSaved.createdAt,
        updatedAt :userSaved.updatedAt,
    })
    // res.send("registrando")
    // res.json({
    // message: "User Create Successfully",
    // })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
   
}

export const login = async (req,res)=>{
    const{email,password} = req.body

    try {
        const userFound = await User.findOne({email})//busca el usuario por su email
        if(!userFound) return res.status(400).json({message:"User not found"});//si no lo encuentra

        const isMatch = await bcrypt.compare(password,userFound.password)//compara con password
        if(!isMatch) return res.status(400).json({message:"Incorrect Password"});//si no es igual

    const token = await createAccessToken ({id:userFound._id});
    res.cookie('token',token);
    res.json({
        id: userFound.id,
        username: userFound.username,
        email :userFound.email,
        role:userFound.role,
        createdAt :userFound.createdAt,
        updatedAt :userFound.updatedAt,
    })
    // res.send("registrando")
    // res.json({
    // message: "User Create Successfully",
    // })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
   
}

export const logout = (req,res)=>{
    res.cookie('token',"",{
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const profile = async (req,res)=>{
    const userFound = await User.findById(req.user.id)
    if(!userFound) return res.status(400).json({message: "User not found"})
    return res.json({
        id: userFound.id,
        username: userFound.username,
        email :userFound.email,
        role: userFound.role,
        createdAt :userFound.createdAt,
        updatedAt :userFound.updatedAt,
    })
}

export const verifyToken = async (req,res)=>{
    const {token} = req.cookies
    if(!token) return res.status(401).json({message: "Sin autorizacion"});
    jwt.verify(token, TOKEN_SECRET, async (err,user)=>{
        if (err) return res.status(401).json({message: "Sin autorizacion"});

        const userFound = await User.findById(user.id)
        if(!userFound) return res.status(401).json({
            message:"Sin autorizacion"
        });

        return res.json({
            id:userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
        });
    });
};

export const createAdmin = async (req,res) =>{
    const {email,password,username,key} = req.body;

    
    try {
        if(key!== process.env.ADMIN_CREATION_KEY && key !== ADMIN_CREATION_KEY){//valido clave secreta
            return res.status(403).json({message:"Invalid admin creation key"});
        }

        const userFound = await User.findOne({email});//revisa si ya existe
        if (userFound) return res.status(400).json({message: "Email already Exists"});

        const passwordHash = await bcrypt.hash(password,10);//encripto

        const newAdmin = new User({//creo admin
            username,
            email,
            password:passwordHash,
            role:"admin"
        });

        const savedAdmin = await newAdmin.save();

        res.json({
            id: savedAdmin._id,
            username: savedAdmin.username,
            email: savedAdmin.email,
            role: savedAdmin.role,
            createdAt:savedAdmin.createdAt,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}