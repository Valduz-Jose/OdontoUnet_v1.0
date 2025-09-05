import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try {
        await mongoose.connect('mongodb://localhost/odontoUnet');
        console.log(">>> DB is Conected");
    } catch (error) {
        console.log(error);
    }
}