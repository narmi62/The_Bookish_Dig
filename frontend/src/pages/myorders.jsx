import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Current Firebase user:", user);

      if (!user) {
        setError("Please log in first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = await user.getIdToken();

        const response = await fetch(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <p className="p-8 text-center text-stone-600">Loading your orders...</p>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] p-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-stone-800">My Orders</h1>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-stone-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 border-b border-stone-200 pb-4 sm:flex-row">
                  <div>
                    <h2 className="text-lg font-bold text-stone-800">
                      Order Details
                    </h2>

                    <p className="mt-1 break-all text-sm text-stone-500">
                      Order ID: {order._id}
                    </p>
                  </div>

                  <span className="h-fit w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                    {order.status || "Processing"}
                  </span>
                </div>

                <div className="space-y-2 py-4 text-stone-700">
                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customer?.fullName || "N/A"}
                  </p>

                  <p>
                    <strong>Total Amount:</strong>{" "}
                    <span className="font-bold text-emerald-700">
                      ₹{order.totalAmount}
                    </span>
                  </p>

                  <p>
                    <strong>Number of book entries:</strong>{" "}
                    {order.books?.length || 0}
                  </p>
                </div>

                <div className="border-t border-stone-200 pt-4">
                  <h3 className="mb-3 font-semibold text-stone-800">
                    Books Ordered
                  </h3>

                  {order.books?.map((item, index) => {
                    const title =
                      item.title || item.bookId?.title || "Book unavailable";
                    const author = item.author || item.bookId?.author || "N/A";
                    const image = item.image || item.bookId?.image;
                    const price = item.priceAtPurchase ?? item.bookId?.price;

                    return (
                      <div
                        key={item._id || index}
                        className="flex items-center gap-4 border-b py-4"
                      >
                        {image && (
                          <img
                            src={image}
                            alt={title}
                            className="h-24 w-16 rounded object-contain"
                          />
                        )}

                        <div className="flex-1">
                          <h4 className="font-semibold text-stone-800">
                            {title}
                          </h4>

                          <p className="text-sm text-stone-500">
                            Author: {author}
                          </p>

                          <p className="text-sm text-stone-600">
                            Quantity: {item.quantity}
                          </p>

                          {price != null && (
                            <p className="text-sm text-stone-600">
                              Price at Purchase: ₹{price}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
