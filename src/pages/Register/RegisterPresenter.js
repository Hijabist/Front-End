import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

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
        title: "Creating account...",
        description: "Please wait while we set up your account.",
      });

      const userData = {
        name: this.name
      };

      const newUser = await this.authContext.register(this.email, this.password, userData);

      this.toast({
        title: "Account created successfully!",
        description: `Welcome to HijabColor, ${this.name}!`,
      });

      setTimeout(() => {
        this.navigate('/profile');
      }, 1500);

    } catch (error) {
      console.error('Registration error:', error);
      
      this.toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An error occurred while creating your account. Please try again.",
      });
    } finally {
      this.isLoading = false;
    }
  }

  validateForm() {
    // Validate name
    if (!this.name.trim()) {
      this.toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter your full name.",
      });
      return false;
    }

    if (this.name.trim().length < 2) {
      this.toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name must be at least 2 characters long.",
      });
      return false;
    }

    // Validate email
    if (!this.email.trim() || !this.isValidEmail(this.email)) {
      this.toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a valid email address.",
      });
      return false;
    }

    // Validate password
    if (this.password.length < 6) {
      this.toast({
        variant: "destructive",
        title: "Validation Error",
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
    
    if (this.password.length >= 6) strength += 1;
    if (this.password.length >= 8) strength += 1;
    if (/\d/.test(this.password)) strength += 1;
    if (/[A-Z]/.test(this.password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) strength += 1;

    if (strength <= 2) return "weak";
    if (strength <= 3) return "medium";
    return "strong";
  }

  // Check if form is valid for button state
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
    updateName: (name) => {
      setName(name);
      presenter.updateName(name);
    },
    updateEmail: (email) => {
      setEmail(email);
      presenter.updateEmail(email);
    },
    updatePassword: (password) => {
      setPassword(password);
      presenter.updatePassword(password);
    },
    handleRegister: async (e) => {
      setIsLoading(true);
      await presenter.handleRegister(e);
      setIsLoading(false);
    },
    isFormValid: presenter.isFormValid(),
    passwordStrength: presenter.getPasswordStrength(),
    clearForm: () => {
      presenter.clearForm();
      setName("");
      setEmail("");
      setPassword("");
    }
  };
};