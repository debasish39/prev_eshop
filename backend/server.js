import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
// Port
const PORT = process.env.PORT || 8000;


// MongoDB Connection + Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    // ✅ Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:");
    console.log(err);
  });