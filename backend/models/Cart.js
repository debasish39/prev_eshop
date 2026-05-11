import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    clerk_user_id: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;