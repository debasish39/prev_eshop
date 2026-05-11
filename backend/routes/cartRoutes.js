import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();


// SAVE OR UPDATE CART
router.post("/", async (req, res) => {
  try {

    const { clerk_user_id, items } = req.body;

    let cart = await Cart.findOne({ clerk_user_id });

    if (cart) {

      cart.items = items;

      await cart.save();

    } else {

      cart = await Cart.create({
        clerk_user_id,
        items,
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to save cart",
    });
  }
});


// GET USER CART
router.get("/:clerkId", async (req, res) => {
  try {

    const cart = await Cart.findOne({
      clerk_user_id: req.params.clerkId,
    });

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
});

// REMOVE SINGLE ITEM FROM CART
router.delete(
  "/remove-item/:clerkId/:itemId",
  async (req, res) => {
    try {

      const { clerkId, itemId } = req.params;

      const cart = await Cart.findOne({
        clerk_user_id: clerkId,
      });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      // Remove item
      cart.items = cart.items.filter(
        (item) => item.id !== itemId
      );

      await cart.save();

      res.status(200).json({
        success: true,
        message: "Item removed successfully",
        cart,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to remove item",
      });
    }
  }
);

// CLEAR CART
router.delete("/:clerkId", async (req, res) => {
  try {

    await Cart.findOneAndDelete({
      clerk_user_id: req.params.clerkId,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
});

export default router;