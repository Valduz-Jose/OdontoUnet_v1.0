import app from "./app.js";
import { connectDB } from "./db.js";

connectDB();
app.listen(3000);
console.log("Server on port", 3000);

// import app from "./app.js";
// import { connectDB } from "./db.js";

// const PORT = process.env.PORT || 3000;

// connectDB();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
