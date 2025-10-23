import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/odontoUnet");
    console.log(">>> DB is Conected");
  } catch (error) {
    console.log(error);
  }
};

// import mongoose from "mongoose";
// import { MONGODB_URI } from "./config.js";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI);
//     console.log(">>> DB is Connected");
//   } catch (error) {
//     console.error("Error conectando a MongoDB:", error);
//     process.exit(1); // Termina el proceso si no puede conectar
//   }
// };
