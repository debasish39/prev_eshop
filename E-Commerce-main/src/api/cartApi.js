import axios from "axios";

const API_BASE =
  "https://prev-eshop.onrender.com/api";


// ==========================
// SAVE / UPDATE CART
// ==========================
export const saveCartToDjango = async (
  clerk_user_id,
  cartItems
) => {

  try {

    const response = await axios.post(
      `${API_BASE}/cart`,
      {
        clerk_user_id,
        items: cartItems,
      }
    );

    console.log(
      "Cart saved:",
      response.data
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error saving cart:",
      error
    );
  }
};


// ==========================
// FETCH USER CART
// ==========================
export const fetchCartFromBackend =
  async (clerk_user_id) => {

    try {

      const response = await axios.get(
        `${API_BASE}/cart/${clerk_user_id}`
      );

      return response.data.cart;

    } catch (error) {

      console.error(
        "Error fetching cart:",
        error
      );
    }
  };


// ==========================
// REMOVE SINGLE ITEM
// ==========================
export const removeSingleItemBackend =
  async (
    clerk_user_id,
    itemId
  ) => {

    try {

      const response =
        await axios.delete(
          `${API_BASE}/cart/remove-item/${clerk_user_id}/${itemId}`
        );

      return response.data;

    } catch (error) {

      console.error(
        "Error removing item:",
        error
      );
    }
  };


// ==========================
// CLEAR CART
// ==========================
export const clearCartBackend =
  async (clerk_user_id) => {

    try {

      const response =
        await axios.delete(
          `${API_BASE}/cart/${clerk_user_id}`
        );

      return response.data;

    } catch (error) {

      console.error(
        "Error clearing cart:",
        error
      );
    }
  };


// ==========================
// CREATE ORDER
// ==========================
export const createOrder = async (
  orderData
) => {

  try {

    const response = await axios.post(
      `${API_BASE}/order`,
      orderData
    );

    console.log(
      "Order created:",
      response.data
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error creating order:",
      error
    );
  }
};