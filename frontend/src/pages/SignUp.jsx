import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState } from "react";

function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      await signOut(auth);
      alert("Sign up successful! Please log in.");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (error.code === "auth/weak-password") {
        setError("Password must contain at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Sign up failed. Please try again.");
        console.error("Sign-up error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          The Bookish Dig
        </h1>

        <h2 className="mb-6 text-center text-xl font-semibold text-gray-600">
          Create Your Account
        </h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              minLength={6}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Use at least 6 characters.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;