import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaRegTrashAlt,
  FaCreditCard,
} from "react-icons/fa";

import { LuNotebookText } from "react-icons/lu";

import { MdDeliveryDining } from "react-icons/md";

import { GiShoppingBag } from "react-icons/gi";

import emptyCart from "../assets/empty-cart.png";

import "react-tooltip/dist/react-tooltip.css";

export default function Cart({
  location,
  getLocation,
}) {
  const {
    cartItem,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  const { user } = useUser();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("razorpay");

  const [checkoutForm, setCheckoutForm] =
    useState({
      full_name:
        user?.fullName || "",

      address:
        location?.county || "",

      city:
        location?.state || "",

      pincode:
        location?.postcode || "",

      country:
        location?.country || "",

      phone: "",
    });

  // ==========================================
  // TOTALS
  // ==========================================
  const totalPrice =
    cartItem.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          item.quantity,
      0
    );

  const totalAmount = (
    totalPrice + 5
  ).toFixed(2);

  // ==========================================
  // FORM HANDLE
  // ==========================================
  const handleChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]:
        e.target.value,
    });
  };

  // ==========================================
  // CREATE ORDER
  // ==========================================
  const createOrder = async (
    paymentData = {}
  ) => {
    try {

      setLoading(true);

      const orderData = {
        clerk_user_id:
          user?.id,

        user_name:
          checkoutForm.full_name,

        user_email:
          user
            ?.primaryEmailAddress
            ?.emailAddress ||
          "guest@example.com",

        items: cartItem,

        total_amount:
          Number(totalAmount),

        payment_method:
          paymentMethod,

        payment_status:
          paymentMethod ===
          "cod"
            ? "COD"
            : "Paid",

        address:
          checkoutForm.address,

        city:
          checkoutForm.city,

        pincode:
          checkoutForm.pincode,

        country:
          checkoutForm.country,

        phone:
          checkoutForm.phone,

        ...paymentData,
      };

      const response =
        await axios.post(
          "http://localhost:8000/api/order",
          orderData
        );

      console.log(
        "Order Success:",
        response.data
      );

      clearCart();

      alert(
        "Order placed successfully!"
      );

      navigate("/order-success");

    } catch (error) {

      console.error(error);

      alert(
        "Failed to place order"
      );

    } finally {

      setLoading(false);
    }
  };

  // ==========================================
  // RAZORPAY
  // ==========================================
  const handleRazorpayPayment =
    async () => {
      try {

        setLoading(true);

        const { data } =
          await axios.post(
            "http://localhost:8000/api/payment/create-razorpay-order",
            {
              amount:
                Number(
                  totalAmount
                ),
            }
          );

    const options = {
  key:
    import.meta.env
      .VITE_RAZORPAY_KEY_ID,

  amount:
    data.order.amount,

  currency:
    data.order.currency,

  name: "E-Shop",

  description:
    "Order Payment",

  image:
    "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",

  order_id:
    data.order.id,

  theme: {
    color: "#dc2626",
  },

  modal: {
    ondismiss: function () {
      alert(
        "Payment cancelled"
      );
    },
  },

  prefill: {
    name:
      checkoutForm.full_name,

    email:
      user
        ?.primaryEmailAddress
        ?.emailAddress,

    contact:
      checkoutForm.phone,
  },

  handler: async function (
    response
  ) {
    try {

      const verifyRes =
        await axios.post(
          "http://localhost:8000/api/payment/verify-payment",
          {
            razorpay_order_id:
              response.razorpay_order_id,

            razorpay_payment_id:
              response.razorpay_payment_id,

            razorpay_signature:
              response.razorpay_signature,
          }
        );

      if (
        verifyRes.data.success
      ) {

        await createOrder({
          razorpay_order_id:
            response.razorpay_order_id,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_signature:
            response.razorpay_signature,

          payment_status:
            "Paid",
        });

      } else {

        alert(
          "Payment verification failed"
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Payment verification failed"
      );
    }
  },
};

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (error) {

        console.log(error);

        alert(
          "Payment Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // ==========================================
  // CHECKOUT
  // ==========================================
  const handleCheckout =
    async () => {

      if (
        cartItem.length === 0
      ) {
        return alert(
          "Your cart is empty"
        );
      }

      // VALIDATION
      if (
        !checkoutForm.full_name ||
        !checkoutForm.address ||
        !checkoutForm.city ||
        !checkoutForm.pincode ||
        !checkoutForm.country ||
        !checkoutForm.phone
      ) {
        return alert(
          "Please fill all delivery fields"
        );
      }

      // COD
      if (
        paymentMethod === "cod"
      ) {

        const confirmCod =
          window.confirm(
            "Confirm Cash on Delivery order?"
          );

        if (confirmCod) {
          await createOrder();
        }

        return;
      }

      // RAZORPAY
      await handleRazorpayPayment();
    };

  // ==========================================
  // EMPTY CART
  // ==========================================
  if (cartItem.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4">
        <img
          src={emptyCart}
          alt="Empty Cart"
          className="w-56"
        />

        <h2 className="text-3xl font-bold text-red-100 mt-6">
          Your cart is empty
        </h2>

        <p className="text-red-300 mt-2">
          Add some products to
          continue shopping
        </p>

        <button
          onClick={() =>
            navigate(
              "/products"
            )
          }
          className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-red-100">
          Cart Management
        </h2>

        <span className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30">
          {cartItem.length} items
        </span>
      </div>

      {/* CART GRID */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {cartItem.map(
          (item) => (
            <div
              key={item.id}
              className="bg-black/60 rounded-2xl overflow-hidden border border-red-500/20 backdrop-blur-md shadow-lg"
            >
              <img
                src={
                  item.images?.[0]
                }
                alt={item.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">

                <h3 className="text-red-100 font-medium line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-red-400 font-bold mt-2">
                  ₹ {item.price}
                </p>

                <div className="flex items-center justify-between mt-4">

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        decreaseQty(
                          item.id
                        )
                      }
                      className="w-8 h-8 rounded-full bg-red-500/20"
                    >
                      -
                    </button>

                    <span>
                      {
                        item.quantity
                      }
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(
                          item.id
                        )
                      }
                      className="w-8 h-8 rounded-full bg-red-500/20"
                    >
                      +
                    </button>

                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                    className="text-red-500"
                  >
                    <FaRegTrashAlt />
                  </button>

                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* SUMMARY */}
      <div className="grid lg:grid-cols-2 gap-6 mt-10">

        {/* DELIVERY */}
        <div className="bg-black/60 rounded-2xl p-5 border border-red-500/20 backdrop-blur-md">

          <h3 className="text-2xl font-semibold text-red-100 mb-5">
            Delivery Information
          </h3>

          <div className="space-y-4">

            <input
              type="text"
              name="full_name"
              value={
                checkoutForm.full_name
              }
              onChange={
                handleChange
              }
              placeholder="Full Name"
              className="w-full bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="address"
              value={
                checkoutForm.address
              }
              onChange={
                handleChange
              }
              placeholder="Address"
              className="w-full bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                name="city"
                value={
                  checkoutForm.city
                }
                onChange={
                  handleChange
                }
                placeholder="City"
                className="bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                name="pincode"
                value={
                  checkoutForm.pincode
                }
                onChange={
                  handleChange
                }
                placeholder="Pincode"
                className="bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 outline-none"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                name="country"
                value={
                  checkoutForm.country
                }
                onChange={
                  handleChange
                }
                placeholder="Country"
                className="bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                name="phone"
                value={
                  checkoutForm.phone
                }
                onChange={
                  handleChange
                }
                placeholder="Phone"
                className="bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 outline-none"
              />

            </div>

            <button
              onClick={
                getLocation
              }
              className="w-full border border-red-500/30 text-red-300 py-3 rounded-xl hover:bg-red-500/10"
            >
              Detect Location
            </button>

          </div>
        </div>

        {/* BILL */}
        <div className="bg-black/60 rounded-2xl p-5 border border-red-500/20 backdrop-blur-md">

          <h3 className="text-2xl font-semibold text-red-100 mb-5">
            Bill Summary
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-red-300">
                <LuNotebookText />
                Items Total
              </span>

              <span>
                ₹ {totalPrice}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-red-300">
                <MdDeliveryDining />
                Delivery
              </span>

              <span>
                FREE
              </span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-red-300">
                <GiShoppingBag />
                Handling
              </span>

              <span>
                ₹ 5
              </span>
            </div>

            <hr className="border-red-500/20" />

            <div className="flex justify-between text-xl font-bold">
              <span>
                Grand Total
              </span>

              <span>
                ₹ {totalAmount}
              </span>
            </div>

          </div>

          {/* PAYMENT METHODS */}
          <div className="mt-8 space-y-4">

            <button
              onClick={() =>
                setPaymentMethod(
                  "razorpay"
                )
              }
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                paymentMethod ===
                "razorpay"
                  ? "border-green-500 bg-green-500/10"
                  : "border-red-500/20 bg-black/40"
              }`}
            >
              <div className="text-left">
                <h4 className="font-semibold">
                  Online Payment
                </h4>

                <p className="text-sm text-gray-400">
                  UPI / Cards /
                  Wallets
                </p>
              </div>

              <FaCreditCard className="text-2xl text-green-400" />
            </button>

            <button
              onClick={() =>
                setPaymentMethod(
                  "cod"
                )
              }
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                paymentMethod ===
                "cod"
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-red-500/20 bg-black/40"
              }`}
            >
              <div className="text-left">
                <h4 className="font-semibold">
                  Cash on Delivery
                </h4>

                <p className="text-sm text-gray-400">
                  Pay after delivery
                </p>
              </div>

              <span className="text-2xl">
                💵
              </span>
            </button>

            <button
              onClick={
                handleCheckout
              }
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                paymentMethod ===
                "cod"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading
                ? "Processing..."
                : paymentMethod ===
                  "cod"
                ? "Place COD Order"
                : "Pay with Razorpay"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}