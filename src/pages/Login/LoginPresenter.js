import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

export class LoginPresenter {
  constructor() {
    this.email = "";
    this.password = "";
    this.isLoading = false;
    this.rememberMe = false;
  }

  init(navigate, toast, authContext) {
    this.navigate = navigate;
    this.toast = toast;
    this.authContext = authContext;
  }

  updateEmail(email) {
    this.email = email || "";
  }

  updatePassword(password) {
    this.password = password || "";
  }

  updateRememberMe(remember) {
    this.rememberMe = Boolean(remember);
  }

  async handleLogin(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      this.toast({
        variant: "destructive",
        title: "Error Validasi",
        description: "Mohon isi email dan password dengan benar.",
      });
      return;
    }

    this.isLoading = true;

    try {
      this.toast({
        title: "Signing in...",
        description: "Please wait while we authenticate you.",
      });      const emailStr = String(this.email).trim();
      const passwordStr = String(this.password).trim();

      const userData = await this.authContext.login(emailStr, passwordStr);

      // Save email for remember me
      if (this.rememberMe) {
        localStorage.setItem("rememberEmail", emailStr);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      this.toast({
        title: "Login successful!",
        description: `Welcome back, ${userData?.displayName || userData?.email || 'User'}!`,
      });

      setTimeout(() => {
        this.navigate('/profile');
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      
      this.toast({
        variant: "destructive",
        title: "Login failed",
        description: error?.message || "An error occurred during login. Please try again.",
      });
    } finally {
      this.isLoading = false;
    }
  }

  validateForm() {
    const emailStr = String(this.email || "").trim();
    const passwordStr = String(this.password || "").trim();
    
    if (!emailStr || !passwordStr) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr) && passwordStr.length >= 6;
  }

  isUserLoggedIn() {
    return this.authContext?.isAuthenticated || false;
  }

  getCurrentUserSession() {
    return this.authContext?.user || null;
  }

  async handleLogout() {
    try {
      await this.authContext.logout();
      
      this.toast({
        title: "Successfully logged out",
        description: "You have been signed out of your account.",
      });
      
      this.navigate("/");
    } catch (error) {
      this.toast({
        variant: "destructive",
        title: "Logout error",
        description: error?.message || "Failed to logout. Please try again.",
      });
    }
  }

  getRememberedEmail() {
    try {
      return localStorage.getItem("rememberEmail") || "";
    } catch (error) {
      console.error('Error getting remembered email:', error);
      return "";
    }
  }

  clearForm() {
    this.email = "";
    this.password = "";
    this.rememberMe = false;
  }

  isFormValid() {
    return this.validateForm();
  }
}

export const useLoginPresenter = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const authContext = useAuth();

  const presenter = new LoginPresenter();
  presenter.email = email;
  presenter.password = password;
  presenter.isLoading = isLoading;
  presenter.rememberMe = rememberMe;
  presenter.init(navigate, toast, authContext);

  // Initialize remembered email on component mount
  React.useEffect(() => {
    try {
      const rememberedEmail = presenter.getRememberedEmail();
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
        presenter.updateEmail(rememberedEmail);
        presenter.updateRememberMe(true);
      }
    } catch (error) {
      console.error('Error initializing remembered email:', error);
    }
  }, []);

  return {
    email,
    password,
    isLoading,
    rememberMe,
    updateEmail: (email) => {
      const emailStr = String(email || "");
      setEmail(emailStr);
      presenter.updateEmail(emailStr);
    },
    updatePassword: (password) => {
      const passwordStr = String(password || "");
      setPassword(passwordStr);
      presenter.updatePassword(passwordStr);
    },
    updateRememberMe: (remember) => {
      const rememberBool = Boolean(remember);
      setRememberMe(rememberBool);
      presenter.updateRememberMe(rememberBool);
    },
    handleLogin: async (e) => {
      setIsLoading(true);
      await presenter.handleLogin(e);
      setIsLoading(false);
    },
    handleLogout: () => presenter.handleLogout(),
    isFormValid: presenter.isFormValid(),
    isUserLoggedIn: presenter.isUserLoggedIn(),
    getCurrentUserSession: () => presenter.getCurrentUserSession(),
    clearForm: () => {
      presenter.clearForm();
      setEmail("");
      setPassword("");
      setRememberMe(false);
    }
  };
};