import React, { useState } from "react";
import { useWishlist } from "../context/wishlistContext";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const [showModal, setShowModal] =
    useState(false);

  const [showClearModal, setShowClearModal] =
    useState(false);

  const [selectedItemId, setSelectedItemId] =
    useState(null);

  const [activeCardId, setActiveCardId] =
    useState(null);

  // ==========================================
  // REMOVE SINGLE ITEM
  // ==========================================
  const handleRemoveItem = (id) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const confirmRemoveItem = () => {
    if (selectedItemId) {
      removeFromWishlist(selectedItemId);
    }

    setShowModal(false);
    setSelectedItemId(null);
  };

  // ==========================================
  // CLEAR ALL
  // ==========================================
  const handleClearWishlist = () =>
    setShowClearModal(true);

  const confirmClearAll = () => {
    clearWishlist();
    setShowClearModal(false);
  };

  // ==========================================
  // MOBILE OVERLAY TOGGLE
  // ==========================================
  const toggleOverlay = (id) => {
    setActiveCardId(
      activeCardId === id ? null : id
    );
  };

  // ==========================================
  // EMPTY UI
  // ==========================================
  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-2">
          Your wishlist is empty 💔
        </h2>

        <p className="text-gray-500 text-sm sm:text-base max-w-md">
          Start adding products you love
          and they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#140202] to-black text-white px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          ❤️ My Wishlist
        </h1>

        <button
          onClick={handleClearWishlist}
          className="w-full sm:w-auto bg-red-500/20 border border-red-400/40 text-red-300 px-5 py-3 rounded-xl hover:bg-red-500/30 transition-all duration-300 text-sm font-medium"
        >
          Clear Wishlist
        </button>
      </div>

      {/* ==========================================
          GRID
      ========================================== */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlist.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              toggleOverlay(item.id)
            }
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-red-500/20 transition-all duration-300"
          >
            {/* IMAGE */}
            <div className="relative w-full h-60 sm:h-72 overflow-hidden">
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/300"
                }
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* PRICE */}
              <div className="absolute top-3 left-3 bg-red-500/90 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                ₹{item.price}
              </div>

              {/* OVERLAY */}
              <div
                className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300 ${
                  activeCardId === item.id
                    ? "opacity-100"
                    : "opacity-0 md:group-hover:opacity-100"
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-300"
                >
                  <FaTrash />
                  Remove
                </button>
              </div>
            </div>

            {/* INFO */}
            <div className="p-4 sm:p-5">
             
                <h2 className="text-lg sm:text-xl font-semibold line-clamp-2 hover:text-red-400 transition-colors">
                  {item.title}
                </h2>
              

              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {item.description ||
                  "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          REMOVE MODAL
      ========================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center h-[300px] justify-center px-4">
          <div className="w-full max-w-md  border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="text-xl font-bold mb-3">
              Remove Item?
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to
              remove this item from your
              wishlist?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={confirmRemoveItem}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          CLEAR MODAL
      ========================================== */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 h-[300px] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="text-xl font-bold mb-3">
              Clear Wishlist?
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              This will permanently remove
              all wishlist items.
            </p>

            <div className="flex flex-col  sm:flex-row gap-3">
              <button
                onClick={() =>
                  setShowClearModal(false)
                }
                className="flex-1 py-1 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={confirmClearAll}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}