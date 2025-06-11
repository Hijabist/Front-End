import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

export class ForgotPasswordPresenter {
  constructor() {
    this.email = "";
    this.isLoading = false;
    this.isEmailSent = false;
  }

  init(navigate, toast) {
    this.navigate = navigate;
    this.toast = toast;
  }

  setEmail(email) {
    this.email = email;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async sendResetEmail() {
    if (!this.email.trim()) {
      this.toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    this.isLoading = true;

    try {
      await sendPasswordResetEmail(auth, this.email);
      
      this.isEmailSent = true;
      this.toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });

    } catch (error) {
      console.error("❌ Password reset error:", error);
      
      let errorMessage = "Failed to send reset email. Please try again.";
      
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      this.toast({
        variant: "destructive",
        title: "Reset Failed",
        description: errorMessage,
      });
    } finally {
      this.isLoading = false;
    }
  }

  handleBackToLogin() {
    this.navigate("/login");
  }

  handleResendEmail() {
    this.isEmailSent = false;
    this.sendResetEmail();
  }
}

export const useForgotPasswordPresenter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const [presenter] = useState(() => new ForgotPasswordPresenter());

  // Initialize presenter
  presenter.init(navigate, toast);
  presenter.email = email;
  presenter.isLoading = isLoading;
  presenter.isEmailSent = isEmailSent;

  return {
    email,
    isLoading,
    isEmailSent,
    
    setEmail: (newEmail) => {
      setEmail(newEmail);
      presenter.setEmail(newEmail);
    },

    sendResetEmail: async () => {
      setIsLoading(true);
      await presenter.sendResetEmail();
      setIsLoading(presenter.isLoading);
      setIsEmailSent(presenter.isEmailSent);
    },

    handleBackToLogin: () => presenter.handleBackToLogin(),
    
    handleResendEmail: async () => {
      setIsEmailSent(false);
      setIsLoading(true);
      await presenter.handleResendEmail();
      setIsLoading(presenter.isLoading);
      setIsEmailSent(presenter.isEmailSent);
    },
  };
};