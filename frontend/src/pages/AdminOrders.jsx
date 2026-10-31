import { useEffect, useState } from "react";
import { auth } from "../firebase";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Wait until Firebase identifies the current user.
        const user = auth.currentUser;

        if (!user) {
          throw new Error("Please log in with your admin account first.");
        }

        // Get the Firebase authentication token.
        const token = await user.getIdToken();

        // Send the token to the backend.
        const response = await fetch(
          "https://the-bookish-dig.onrender.com/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data);
      } catch (error) {
        console.error("Fetch orders error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Admin Dashboard - Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Order ID</th>
                <th className="border p-3">Customer</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Total Amount</th>
                <th className="border p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border p-3">{order._id}</td>
                  <td className="border p-3">
                    {order.customer?.fullName || "N/A"}
                  </td>
                  <td className="border p-3">
                    {order.customer?.email || "N/A"}
                  </td>
                  <td className="border p-3">
                    ₹{order.totalAmount}
                  </td>
                  <td className="border p-3">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
