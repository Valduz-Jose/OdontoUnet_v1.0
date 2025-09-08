import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,//limpia espacios en blanco
        unique:true,//que no se repitan
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type:String,
        enum: ["admin","odontologo"],//
        default: "odontologo",//
    }
},{
    timestamps: true
})

export default mongoose.model('User',userSchema)