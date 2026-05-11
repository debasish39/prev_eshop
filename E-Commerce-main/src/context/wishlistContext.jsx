import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useUser } from "@clerk/clerk-react";

export const WishlistContext =
  createContext();

const API_URL =
  "https://prev-eshop.onrender.com/api/wishlist";

export const WishlistProvider = ({
  children,
}) => {
  const [wishlist, setWishlist] =
    useState([]);

  const { user } = useUser();

  const clerkId = user?.id;

  // ==========================================
  // FETCH USER WISHLIST
  // ==========================================
  const fetchWishlist = async () => {
    try {
      if (!clerkId) return;

      const res = await axios.get(
        `${API_URL}/${clerkId}`
      );

      setWishlist(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [clerkId]);

  // ==========================================
  // ADD TO WISHLIST
  // ==========================================
  const addToWishlist = async (
    product
  ) => {
    try {

      // USER NOT LOGGED IN
      if (!clerkId) {
        toast.error(
          "Please login first"
        );
        return;
      }

      const payload = {
        clerkId,
        productId: product.id,
        title: product.title,
        price: product.price,

        // FIXED HERE
        image: product.thumbnail,
      };

      const res = await axios.post(
        API_URL,
        payload
      );

      setWishlist((prev) => [
        ...prev,
        res.data.wishlistItem,
      ]);

      toast.success(
        "Added to Wishlist ❤️"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ==========================================
  // REMOVE SINGLE ITEM
  // ==========================================
  const removeFromWishlist = async (
    productId
  ) => {
    try {
      await axios.delete(
        `${API_URL}/${clerkId}/${productId}`
      );

      setWishlist((prev) =>
        prev.filter(
          (item) =>
            item.productId !== productId
        )
      );

      toast.success(
        "Removed from Wishlist 💔"
      );

    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // CLEAR WISHLIST
  // ==========================================
  const clearWishlist = async () => {
    try {
      await axios.delete(
        `${API_URL}/${clerkId}`
      );

      setWishlist([]);

      toast.success(
        "Wishlist Cleared 🧹"
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () =>
  useContext(WishlistContext);