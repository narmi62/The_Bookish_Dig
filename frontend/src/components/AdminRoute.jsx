import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return <p className="p-6 text-center">Checking admin access...</p>;
  }

  const isAdmin =
    user?.email &&
    adminEmail &&
    user.email.toLowerCase() === adminEmail.toLowerCase();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default AdminRoute;