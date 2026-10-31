import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setEmail("");
      setPassword("");

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-amber-950">
          Welcome Back!
        </h1>

        <p className="mb-6 text-center text-stone-600">
          Login to The Bookish Dig
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-950 py-3 font-semibold text-white hover:bg-amber-900"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-amber-900 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;