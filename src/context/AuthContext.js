import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
          };

          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            userData.name = firestoreData.name || firebaseUser.displayName || '';
          }

          // Store minimal user data
          const userSession = {
            uid: userData.uid,
            email: userData.email,
            name: userData.name,
            isLoggedIn: true
          };

          // Store in localStorage
          localStorage.setItem("currentUser", JSON.stringify(userSession));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", userData.email);
          localStorage.setItem("userName", userData.name);
          localStorage.setItem("userUID", userData.uid);

          setUser(userSession);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error getting user data:", error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userUID");

        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const emailStr = String(email).trim();
      const passwordStr = String(password).trim();

      if (!emailStr || !passwordStr) {
        throw new Error("Email and password cannot be empty");
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailStr, passwordStr);
      const firebaseUser = userCredential.user;
      const token = userCredential.user.getIdToken();
      console.log("User token:", token);

      // Get user name from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let userName = firebaseUser.displayName || '';
      
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        userName = firestoreData.name || userName;
      }

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userName,
        isLoggedIn: true
      };

      // The auth state listener will handle the rest
      return userData;
    } catch (error) {
      setIsLoading(false);
      console.error("Error during login:", error);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const register = async (email, password, userData) => {
    try {
      setIsLoading(true);

      if (!email || !password || !userData) {
        throw new Error("Email, password, and user data are required");
      }

      const emailStr = String(email).trim();
      const passwordStr = String(password).trim();

      if (!emailStr || !passwordStr) {
        throw new Error("Email and password cannot be empty");
      }

      if (!userData.name || String(userData.name).trim().length < 2) {
        throw new Error("Name must be at least 2 characters long");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, emailStr, passwordStr);
      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile
      if (userData.name) {
        await updateProfile(firebaseUser, {
          displayName: userData.name
        });
      }

      // Save minimal user data to Firestore
      const userDocData = {
        name: userData.name,
        email: emailStr,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);

      const newUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        isLoggedIn: true
      };

      // The auth state listener will handle the rest
      return newUserData;
    } catch (error) {
      setIsLoading(false);
      console.error("Error during registration:", error);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // The auth state listener will handle clearing the user data
    } catch (error) {
      console.error("Error during logout:", error);
      throw new Error("Failed to logout");
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const emailStr = String(email).trim();
      if (!emailStr) {
        throw new Error("Email cannot be empty");
      }

      await sendPasswordResetEmail(auth, emailStr);
    } catch (error) {
      console.error("Error sending password reset:", error);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    sendPasswordReset
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function for Firebase error messages
function getFirebaseErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'An error occurred. Please try again';
  }
}