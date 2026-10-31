import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [user, setUser] = useState(undefined);

  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Current user:", currentUser);
      console.log("User email:", currentUser?.email);

      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin =
    user?.email &&
    adminEmail &&
    user.email.toLowerCase() === adminEmail.toLowerCase();

  const handleLogout = async () => {
    try {
      const wasAdmin = Boolean(isAdmin);

      await signOut(auth);
      setShowAdminMenu(false);
      alert("Logged out successfully!");

      navigate(wasAdmin ? "/admin/login" : "/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to log out. Please try again.");
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-amber-950 px-6 py-5 text-white md:px-12">
      {/* Logo */}
      <span className="text-2xl font-bold cursor-default">
        📚 The Bookish Dig
      </span>

      <div className="flex flex-wrap items-center gap-5 text-sm font-medium md:text-base">
        {/* Home */}
        <Link to="/home" className="hover:text-amber-300">
          Home
        </Link>

        {/* Books */}
        <a href="/home#books" className="hover:text-amber-300">
          Books
        </a>

        {/* Cart */}
        <Link to="/cart" className="hover:text-amber-300">
          Cart
        </Link>

        {/* My Orders */}
        <Link to="/myorders" className="hover:text-amber-300">
          My Orders
        </Link>

        {/* Customer Login and Sign Up */}
        {user === undefined ? (
          <span>Checking login...</span>
        ) : !user ? (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-amber-300">
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-amber-950 transition hover:bg-amber-400"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <button onClick={handleLogout} className="hover:text-amber-300">
            Logout
          </button>
        )}
        {/* Admin Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            className="hover:text-amber-300"
          >
            Admin ▼
          </button>

          {showAdminMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg bg-white py-2 text-stone-800 shadow-lg">
              {isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-left font-medium transition hover:bg-amber-100"
                >
                  🚪 Admin Logout
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setShowAdminMenu(false)}
                  className="block px-4 py-3 font-medium transition hover:bg-amber-100"
                >
                  🔐 Admin Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
