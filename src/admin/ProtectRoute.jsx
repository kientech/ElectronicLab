import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../database/db";

const ProtectRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking authentication
  }

  // Mock check for admin role (replace with actual role checking)
  const isAdmin = user && user.email === "duongtrungkien.dev@gmail.com"; // Replace this with real admin check

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectRoute;
