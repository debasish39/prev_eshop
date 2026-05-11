import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    // Clerk User ID
    clerkId: {
      type: String,
      required: true,
    },

    // Product ID
    productId: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


// Prevent duplicate wishlist items for same user
wishlistSchema.index(
  { clerkId: 1, productId: 1 },
  { unique: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;