import React, { createContext, useContext, useState, useEffect } from 'react';
import { register as registerAPI } from '../data/remote/authApi';
import { AuthService } from '../data/remote/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Set up Firebase Auth state listener
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in, get additional data from Firestore
          const token = await firebaseUser.getIdToken();
          
          // Check if we have user data in localStorage
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('token');
          
          if (storedUser && storedToken) {
            // Use stored data
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Fetch displayName from Firestore if needed
            let displayName = firebaseUser.displayName;
            try {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                displayName = userData.displayName || userData.name || firebaseUser.displayName;
              }
            } catch (firestoreError) {
              console.warn("Failed to fetch user data from Firestore:", firestoreError);
            }
            
            const userToStore = {
              uid: firebaseUser.uid,
              displayName: displayName,
              email: firebaseUser.email,
            };
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userToStore));
            setUser(userToStore);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error setting up user session:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const login = async (email, password) => {
    try {
      const userData = await AuthService.loginWithEmail(auth, email, password);
      
      // Store only the specified fields
      const userToStore = {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
      };
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if Firebase logout fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (displayName, email, password) => {
    try {
      const result = await registerAPI(displayName, email, password);
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };
  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};