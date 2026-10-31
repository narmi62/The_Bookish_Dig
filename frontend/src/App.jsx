import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Products";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/myorders";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
