import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";

export class RegisterPresenter {
  constructor() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.isLoading = false;
  }

  init(navigate, toast, authContext) {
    this.navigate = navigate;
    this.toast = toast;
    this.authContext = authContext;
  }

  updateName(name) {
    this.name = name;
  }

  updateEmail(email) {
    this.email = email;
  }

  updatePassword(password) {
    this.password = password;
  }

  async handleRegister(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      this.toast({
        title: "Creating Account...",
        description: "Please wait while we create your account.",
      });

      // Gunakan displayName sesuai parameter API
      const result = await this.authContext.register(
        this.name,     // displayName
        this.email,    // email
        this.password  // password
      );

      this.toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please login to continue.",
      });

      // Clear form
      this.clearForm();

      // Redirect ke halaman login
      this.navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);
      this.toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      this.isLoading = false;
    }
  }

  validateForm() {
    if (!this.name.trim()) {
      this.toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please enter your name.",
      });
      return false;
    }

    if (this.name.trim().length < 2) {
      this.toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Name must be at least 2 characters long.",
      });
      return false;
    }

    if (!this.email.trim()) {
      this.toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return false;
    }

    if (!this.password) {
      this.toast({
        variant: "destructive",
        title: "Password Required",
        description: "Please enter a password.",
      });
      return false;
    }

    if (this.password.length < 6) {
      this.toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
      });
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  getPasswordStrength() {
    if (this.password.length === 0) return null;
    
    let strength = 0;
    
    // Length check
    if (this.password.length >= 6) strength += 1;
    if (this.password.length >= 8) strength += 1;
    
    // Character type checks
    if (/[a-z]/.test(this.password)) strength += 1;
    if (/[A-Z]/.test(this.password)) strength += 1;
    if (/[0-9]/.test(this.password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) strength += 1;

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  }

  isFormValid() {
    return (
      this.name.trim().length >= 2 &&
      this.isValidEmail(this.email) &&
      this.password.length >= 6
    );
  }

  clearForm() {
    this.name = "";
    this.email = "";
    this.password = "";
  }
}

export const useRegisterPresenter = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const authContext = useAuth();

  const presenter = new RegisterPresenter();
  presenter.name = name;
  presenter.email = email;
  presenter.password = password;
  presenter.isLoading = isLoading;
  presenter.init(navigate, toast, authContext);

  return {
    name,
    email,
    password,
    isLoading,
    passwordStrength: presenter.getPasswordStrength(),
    updateName: (value) => {
      setName(value);
      presenter.updateName(value);
    },
    updateEmail: (value) => {
      setEmail(value);
      presenter.updateEmail(value);
    },
    updatePassword: (value) => {
      setPassword(value);
      presenter.updatePassword(value);
    },
    handleRegister: async (e) => {
      setIsLoading(true);
      try {
        await presenter.handleRegister(e);
      } finally {
        setIsLoading(false);
      }
    },
    isFormValid: () => presenter.isFormValid()
  };
};