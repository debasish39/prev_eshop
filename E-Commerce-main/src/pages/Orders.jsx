import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Orders() {

  const { user } = useUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchOrders = async () => {
    try {

      const res = await axios.get(
        `https://prev-eshop.onrender.com/api/order/user/${user.id}`
      );

      setOrders(res.data.orders);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    if (user?.id) {
      fetchOrders();
    }

  }, [user]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white p-4 md:p-8">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-4xl font-extrabold text-red-500">
          My Orders
        </h1>

        <p className="text-gray-400 mt-2">
          Track all your placed orders and delivery details
        </p>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

      ) : orders.length === 0 ? (

        <div className="flex flex-col items-center justify-center mt-20 text-center">

          <FaBoxOpen className="text-7xl text-red-500/70 mb-5" />

          <h2 className="text-3xl font-bold text-red-400">
            No Orders Found
          </h2>

          <p className="text-gray-400 mt-2">
            Your placed orders will appear here
          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-black/50 border border-red-500/20 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl"
            >

              {/* Top Header */}
              <div className="bg-gradient-to-r from-red-700 to-red-900 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <h2 className="text-lg md:text-xl font-bold">
                    Order ID
                  </h2>

                  <p className="text-sm text-red-100 break-all">
                    {order._id}
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/20">
                    {order.payment_status}
                  </span>

                  <span className="bg-black/30 text-white px-4 py-2 rounded-full text-sm border border-white/10">
                    {order.items.length} Items
                  </span>

                </div>

              </div>


              {/* Main Content */}
              <div className="p-6 grid lg:grid-cols-3 gap-8">

                {/* Products */}
                <div className="lg:col-span-2">

                  <h3 className="text-xl font-bold text-red-400 mb-5">
                    Ordered Products
                  </h3>

                  <div className="space-y-4">

                    {order.items.map((item, index) => (

                      <div
                        key={index}
                        className="flex gap-4 bg-zinc-900/70 border border-red-500/10 rounded-2xl p-4 hover:border-red-500/30 transition"
                      >

                        {/* Product Image */}
                        <img
                          src={
                            item.images?.[0] ||
                            "https://via.placeholder.com/120"
                          }
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-xl"
                        />

                        {/* Product Info */}
                        <div className="flex-1">

                          <h4 className="font-semibold text-lg text-white">
                            {item.title}
                          </h4>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-300">

                            <span>
                              Quantity:
                              <span className="text-red-400 ml-1 font-semibold">
                                {item.quantity}
                              </span>
                            </span>

                            <span>
                              Price:
                              <span className="text-red-400 ml-1 font-semibold">
                                ₹ {item.price}
                              </span>
                            </span>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>


                {/* Order Summary */}
                <div>

                  <div className="bg-zinc-900/70 border border-red-500/20 rounded-2xl p-5 sticky top-5">

                    <h3 className="text-xl font-bold text-red-400 mb-5">
                      Order Summary
                    </h3>

                    <div className="space-y-4 text-sm">

                      <div className="flex items-start gap-3">
                        <FaMoneyBillWave className="text-red-500 mt-1" />

                        <div>
                          <p className="text-gray-400">
                            Total Amount
                          </p>

                          <p className="font-bold text-lg text-white">
                            ₹ {order.total_amount}
                          </p>
                        </div>
                      </div>


                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-red-500 mt-1" />

                        <div>
                          <p className="text-gray-400">
                            Delivery Address
                          </p>

                          <p className="text-white leading-6">
                            {order.address},
                            <br />
                            {order.city} - {order.pincode},
                            <br />
                            {order.country}
                          </p>
                        </div>
                      </div>


                      <div className="flex items-start gap-3">
                        <FaPhoneAlt className="text-red-500 mt-1" />

                        <div>
                          <p className="text-gray-400">
                            Phone Number
                          </p>

                          <p className="text-white">
                            {order.phone}
                          </p>
                        </div>
                      </div>


                      <div className="flex items-start gap-3">
                        <FaCalendarAlt className="text-red-500 mt-1" />

                        <div>
                          <p className="text-gray-400">
                            Ordered On
                          </p>

                          <p className="text-white">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}