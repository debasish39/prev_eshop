import express from "express";
import Order from "../models/Order.js";

const router = express.Router();


// ==========================================
// CREATE ORDER
// ==========================================
router.post("/", async (req, res) => {
  try {

    console.log(
      "Incoming Order:",
      req.body
    );

    const {
      clerk_user_id,
      user_name,
      user_email,
      items,
      total_amount,
      payment_method,
      payment_status,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      city,
      pincode,
      country,
      phone,
    } = req.body;

    // VALIDATION
    if (
      !clerk_user_id ||
      !user_name ||
      !user_email ||
      !items ||
      !total_amount ||
      !address ||
      !city ||
      !pincode ||
      !country ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    const order =
      await Order.create({
        clerk_user_id,
        user_name,
        user_email,
        items,
        total_amount,
        payment_method,
        payment_status,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        address,
        city,
        pincode,
        country,
        phone,
      });

    res.status(201).json({
      success: true,
      message:
        "Order created successfully",
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
});


// ==========================================
// GET ALL ORDERS
// ==========================================
router.get("/", async (req, res) => {
  try {

    const orders =
      await Order.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders",
    });
  }
});


// ==========================================
// GET ORDERS OF SPECIFIC USER
// IMPORTANT: KEEP ABOVE /:id
// ==========================================
router.get(
  "/user/:clerkId",
  async (req, res) => {
    try {

      const orders =
        await Order.find({
          clerk_user_id:
            req.params.clerkId,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        orders,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch user orders",
      });
    }
  }
);


// ==========================================
// GET SINGLE ORDER
// ==========================================
router.get("/:id", async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        "Order not found",
    });
  }
});

export default router;