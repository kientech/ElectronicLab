import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../database/db";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchAndSetUser(firebaseUser);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchAndSetUser = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({ ...firebaseUser, ...userDoc.data() });
        setUserRole(userDoc.data().role);
      } else {
        // If no Firestore document, create one (e.g., for new sign-ups)
        await setDoc(
          doc(db, "users", firebaseUser.uid),
          {
            displayName: firebaseUser.displayName || "",
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || "",
            role: "user",
            createdAt: new Date(),
          },
          { merge: true }
        );
        setUser(firebaseUser);
        setUserRole("user");
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      // Fallback to basic Firebase user if Firestore fetch fails
      setUser(firebaseUser);
      setUserRole("user");
    }
  };

  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });
      // After sign up, immediately fetch and set user data from Firestore
      await fetchAndSetUser(userCredential.user);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // After login, immediately fetch and set user data from Firestore
    await fetchAndSetUser(userCredential.user);
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const isAdmin = () => {
    return userRole === "admin";
  };

  // New function to manually refresh user data
  const refreshUserData = async () => {
    if (auth.currentUser) {
      await fetchAndSetUser(auth.currentUser);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    isAdmin,
    refreshUserData, // Expose the new function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
