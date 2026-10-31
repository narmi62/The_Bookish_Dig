import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get Firebase authentication token
  const getAuthHeaders = async (includeJson = false) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please log in first.");
    }

    const token = await user.getIdToken();

    return {
      Authorization: `Bearer ${token}`,
      ...(includeJson ? { "Content-Type": "application/json" } : {}),
    };
  };

  // Fetch the logged-in customer's cart
  const fetchCart = async () => {
    try {
      const response = await fetch("https://the-bookish-dig.onrender.com/api/cart", {
        headers: await getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      setCart(data.books || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert(error.message || "Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove a book from cart
  const removeFromCart = async (bookID) => {
    try {
      const response = await fetch(
        `https://the-bookish-dig.onrender.com/api/cart/${bookID}`,
        {
          method: "DELETE",
          headers: await getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove book");
      }

      setCart(data.cart?.books || []);
      alert("Book removed successfully!");
    } catch (error) {
      console.error("Error removing book:", error);
      alert(error.message || "Failed to remove book");
    }
  };

  // Update book quantity
  const updateQuantity = async (bookId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await fetch(
        `https://the-bookish-dig.onrender.com/api/cart/${bookId}`,
        {
          method: "PATCH",
          headers: await getAuthHeaders(true),
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      setCart(data.books || []);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.message || "Failed to update quantity.");
    }
  };

  const grandTotal = cart.reduce((total, item) => {
    return total + (item.bookId?.price || 0) * item.quantity;
  }, 0);

  if (loading) {
    return <p className="p-8 text-center">Loading your cart...</p>;
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] p-8">
      <h1 className="mb-6 text-3xl font-bold">My Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:gap-8"
            >
              <img
                src={item.bookId?.image}
                alt={item.bookId?.title || "Book cover"}
                className="h-32 w-24 rounded object-cover"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold text-stone-800 sm:text-2xl">
                  {item.bookId?.title || "Book unavailable"}
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  By {item.bookId?.author || "Unknown author"}
                </p>

                <p className="mt-4 text-sm text-stone-600">
                  Price:{" "}
                  <span className="font-medium text-stone-800">
                    ₹{item.bookId?.price ?? 0}
                  </span>
                </p>

                <p className="mt-2 text-lg font-bold text-emerald-700">
                  Subtotal: ₹
                  {(item.bookId?.price || 0) * item.quantity}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm text-gray-600">Quantity:</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.bookId._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1 || !item.bookId}
                    className="rounded-lg border border-stone-300 px-3 py-1 font-bold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="min-w-5 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.bookId._id, item.quantity + 1)
                    }
                    disabled={!item.bookId}
                    className="rounded-lg border border-stone-300 px-3 py-1 font-bold text-stone-700 transition hover:bg-stone-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.bookId._id)}
                  disabled={!item.bookId}
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 transition duration-200 hover:bg-red-600 hover:text-white disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-stone-500">Order Summary</p>
                <h2 className="mt-1 text-2xl font-bold text-stone-800">
                  Grand Total
                </h2>
              </div>

              <p className="text-3xl font-bold text-emerald-700">
                ₹{grandTotal}
              </p>
            </div>

            <button
              onClick={() => navigate("/home")}
              className="mt-5 rounded-lg border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              ← Continue Shopping
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-5 ml-3 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
