import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    clerk_user_id: {
      type: String,
      required: true,
    },

    user_name: {
      type: String,
      required: true,
    },

    user_email: {
      type: String,
      required: true,
    },

    items: [
      {
        id: String,

        title: String,

        price: Number,

        quantity: Number,

        images: [String],
      },
    ],

    total_amount: {
      type: Number,
      required: true,
    },

    // ==========================================
    // PAYMENT DETAILS
    // ==========================================
    payment_method: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },

    payment_status: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "COD",
      ],
      default: "Pending",
    },

    order_status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // ==========================================
    // RAZORPAY DETAILS
    // ==========================================
    razorpay_order_id: {
      type: String,
      default: "",
    },

    razorpay_payment_id: {
      type: String,
      default: "",
    },

    razorpay_signature: {
      type: String,
      default: "",
    },

    // ==========================================
    // SHIPPING DETAILS
    // ==========================================
    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;