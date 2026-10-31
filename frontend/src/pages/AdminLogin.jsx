import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!adminEmail) {
        setError("Admin configuration is missing.");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const loggedInUser = userCredential.user;

      if (
        loggedInUser.email?.toLowerCase() !== adminEmail.toLowerCase()
      ) {
        await signOut(auth);
        setError("Access denied. Only the admin can log in here.");
        return;
      }

      alert("Admin login successful!");
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Login failed. Please check your admin email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-amber-950">
          Admin Login
        </h1>

        <p className="mb-6 text-center text-stone-600">
          The Bookish Dig Administration
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />

          {error && (
            <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-950 py-3 font-semibold text-white hover:bg-amber-900 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Admin Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          <Link to="/home" className="font-semibold text-amber-900 underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;