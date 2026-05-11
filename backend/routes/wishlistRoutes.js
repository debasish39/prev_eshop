import express from "express";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();


// ==========================================
// GET USER WISHLIST
// ==========================================
router.get("/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    const wishlist = await Wishlist.find({ clerkId });

    res.status(200).json(wishlist);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// ADD TO WISHLIST
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      clerkId,
      productId,
      title,
      price,
      image,
    } = req.body;

    // Validation
    if (
      !clerkId ||
      !productId ||
      !title ||
      !price ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing product
    const existingItem = await Wishlist.findOne({
      clerkId,
      productId,
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Create new wishlist item
    const wishlistItem = await Wishlist.create({
      clerkId,
      productId,
      title,
      price,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlistItem,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// REMOVE SINGLE ITEM
// ==========================================
router.delete("/:clerkId/:productId", async (req, res) => {
  try {
    const { clerkId, productId } = req.params;

    const deletedItem = await Wishlist.findOneAndDelete({
      clerkId,
      productId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// CLEAR ENTIRE WISHLIST
// ==========================================
router.delete("/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    await Wishlist.deleteMany({ clerkId });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;