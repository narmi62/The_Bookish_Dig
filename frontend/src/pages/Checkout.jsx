import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCart([]);
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      setCustomer((previous) => ({
        ...previous,
        email: user.email || previous.email,
      }));

      try {
        const token = await user.getIdToken();

        const response = await fetch("https://the-bookish-dig.onrender.com/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch cart");
        }

        setCart(data.books || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert(error.message || "Unable to load your cart.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const grandTotal = cart.reduce((total, item) => {
    return total + (item.bookId?.price || 0) * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (placingOrder) return;

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Please log in before placing your order.");
        navigate("/login");
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch("https://the-bookish-dig.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customer }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      alert("Order placed successfully!");

      navigate("/myorders");
    } catch (error) {
      console.error("Order Error:", error);
      alert(error.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <p className="p-8 text-center text-stone-600">
        Loading checkout...
      </p>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] p-8">
        <h1 className="mb-4 text-3xl font-bold text-stone-800">
          Checkout
        </h1>
        <p className="text-stone-600">
          Your cart is empty. Add some books before checking out.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="mt-5 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-stone-800">
          Checkout
        </h1>

        <p className="mb-8 text-stone-600">
          You're one step closer to your next great read!
        </p>

        <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-stone-800">
            Order Summary
          </h2>

          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between gap-4 border-b border-stone-100 pb-3"
              >
                <div>
                  <p className="font-medium text-stone-800">
                    {item.bookId?.title || "Book unavailable"}
                  </p>
                  <p className="text-sm text-stone-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-stone-800">
                  ₹{(item.bookId?.price || 0) * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between text-xl font-bold">
            <span>Grand Total</span>
            <span className="text-emerald-700">
              ₹{grandTotal}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-stone-800">
            Customer Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-stone-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={customer.fullName}
                onChange={(e) =>
                  setCustomer({ ...customer, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-stone-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-stone-700">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-stone-700">
                Delivery Address
              </label>
              <textarea
                placeholder="Enter your complete delivery address"
                rows="3"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-3 outline-none focus:border-emerald-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
