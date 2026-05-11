import React, {
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";

import { toast } from "react-hot-toast";

import { useUser } from "@clerk/clerk-react";

import {
  saveCartToDjango,
  fetchCartFromBackend,
  clearCartBackend,
  removeSingleItemBackend,
} from "../api/cartApi";


export const CartContext = createContext(null);


export default function CartProvider({ children }) {

  const { user } = useUser();

  const [cartItem, setCartItem] = useState([]);

  const [loading, setLoading] = useState(true);


  // LOAD CART FROM BACKEND
  useEffect(() => {

    const loadCart = async () => {

      if (!user?.id) {
        setCartItem([]);
        setLoading(false);
        return;
      }

      try {

        const backendCart =
          await fetchCartFromBackend(user.id);

        if (backendCart?.items) {

          setCartItem(backendCart.items);

        } else {

          setCartItem([]);
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    loadCart();

  }, [user]);


  // SAVE CART TO BACKEND
  useEffect(() => {

    if (user?.id) {

      saveCartToDjango(
        user.id,
        cartItem
      );
    }

  }, [cartItem, user]);


  // ADD TO CART
  const addToCart = (product) => {

    const itemInCart = cartItem.find(
      (item) => item.id === product.id
    );

    if (itemInCart) {

      setCartItem(
        cartItem.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );

      toast.success("Increased quantity");

    } else {

      setCartItem([
        ...cartItem,
        {
          ...product,
          quantity: 1,
        },
      ]);

      toast.success("Added to cart");
    }
  };


  // REMOVE ITEM
  const removeFromCart = async (id) => {

    const updated = cartItem.filter(
      (item) => item.id !== id
    );

    setCartItem(updated);

    if (user?.id) {

      await removeSingleItemBackend(
        user.id,
        id
      );
    }

    toast.success("Removed from cart");
  };


  // INCREASE QUANTITY
  const increaseQty = (id) => {

    setCartItem(
      cartItem.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };


  // DECREASE QUANTITY
  const decreaseQty = (id) => {

    const updated = cartItem
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItem(updated);
  };


  // CLEAR CART
  const clearCart = async () => {

    setCartItem([]);

    if (user?.id) {

      await clearCartBackend(user.id);
    }

    toast.success("Cart cleared");
  };


  return (
    <CartContext.Provider
      value={{
        cartItem,
        loading,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export const useCart = () =>
  useContext(CartContext);