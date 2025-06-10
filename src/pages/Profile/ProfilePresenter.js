import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';


export class ProfilePresenter {
  constructor() {
    this.savedAnalyses = [];
    this.isLoading = true;
    this.currentPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
  }

  init(navigate, toast, authContext) {
    this.navigate = navigate;
    this.toast = toast;
    this.authContext = authContext;
  }
  updateCurrentPassword(password) {
    this.currentPassword = password;
  }

  updateNewPassword(password) {
    this.newPassword = password;
  }

  updateConfirmPassword(password) {
    this.confirmPassword = password;
  }
  async handleChangePassword(e) {
    e.preventDefault();

    if (this.newPassword !== this.confirmPassword) {
      this.toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
      });
      return;
    }

    if (this.newPassword.length < 6) {
      this.toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    try {
      this.toast({
        title: "Changing password...",
        description: "Please wait while we update your password.",
      });

      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        this.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, this.newPassword);

      this.toast({
        title: "Password changed!",
        description: "Your password has been updated successfully.",
      });

      // Clear password fields
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    } catch (error) {
      console.error("Password change error:", error);

      let errorMessage = "Failed to change password.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "New password is too weak.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please logout and login again before changing password.";
      }

      this.toast({
        variant: "destructive",
        title: "Password change failed",
        description: errorMessage,
      });
    }
  }

  async handleLogout() {
    try {
      await this.authContext.logout();

      this.toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });

      this.navigate("/");
    } catch (error) {
      this.toast({
        variant: "destructive",
        title: "Logout error",
        description: error.message || "Failed to logout.",
      });
    }
  }

  handleDeleteAnalysis(analysisId) {
    try {
      // Remove analysis from saved analyses
      this.savedAnalyses = this.savedAnalyses.filter(
        (analysis) => analysis.id !== analysisId
      );

      this.toast({
        title: "Analysis deleted",
        description: "The analysis has been removed from your saved results.",
      });
    } catch (error) {
      this.toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete analysis.",
      });
    }
  }

  handleViewAnalysis(analysisId) {
    // Navigate to analysis results page
    this.navigate(`/results/${analysisId}`);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getShapeInitial(faceShape) {
    return faceShape ? faceShape.charAt(0).toUpperCase() : "F";
  }

  getToneInitial(skinTone) {
    return skinTone ? skinTone.charAt(0).toUpperCase() : "S";
  }

  // Load saved analyses (mock data for now)
  loadSavedAnalyses() {
    // Mock data - replace with actual data loading
    this.savedAnalyses = [
      {
        id: "1",
        faceShape: "Oval",
        skinTone: "Warm",
        confidence: "85%",
        date: "2024-01-15T10:30:00Z",
        colorGroups: ["Earth tones", "Warm colors"],
        recommendations: [
          "https://youtube.com/watch?v=example1",
          "https://youtube.com/watch?v=example2",
        ],
      },
      {
        id: "2",
        faceShape: "Round",
        skinTone: "Cool",
        confidence: "92%",
        date: "2024-01-10T14:15:00Z",
        colorGroups: ["Cool colors", "Jewel tones"],
        recommendations: ["https://youtube.com/watch?v=example3"],
      },
    ];
  }
}

export const useProfilePresenter = () => {
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const authContext = useAuth();
  const presenter = new ProfilePresenter();
  presenter.savedAnalyses = savedAnalyses;
  presenter.isLoading = isLoading;
  presenter.currentPassword = currentPassword;
  presenter.newPassword = newPassword;
  presenter.confirmPassword = confirmPassword;
  presenter.init(navigate, toast, authContext);
  // Initialize data when component mounts
  useEffect(() => {
    if (authContext.user) {
      // Load saved analyses
      presenter.loadSavedAnalyses();
      setSavedAnalyses(presenter.savedAnalyses);

      setIsLoading(false);
    }
  }, [authContext.user]);
  return {
    user: authContext.user,
    savedAnalyses,
    isLoading,
    currentPassword,
    newPassword,
    confirmPassword,
    updateCurrentPassword: (password) => {
      setCurrentPassword(password);
      presenter.updateCurrentPassword(password);
    },
    updateNewPassword: (password) => {
      setNewPassword(password);
      presenter.updateNewPassword(password);
    },
    updateConfirmPassword: (password) => {
      setConfirmPassword(password);
      presenter.updateConfirmPassword(password);
    },
    handleChangePassword: async (e) => {
      await presenter.handleChangePassword(e);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    handleLogout: () => presenter.handleLogout(),
    handleDeleteAnalysis: (analysisId) => {
      presenter.handleDeleteAnalysis(analysisId);
      setSavedAnalyses([...presenter.savedAnalyses]);
    },
    handleViewAnalysis: (analysisId) =>
      presenter.handleViewAnalysis(analysisId),
    formatDate: (date) => presenter.formatDate(date),
    formatTime: (time) => presenter.formatTime(time),
    getShapeInitial: (shape) => presenter.getShapeInitial(shape),
    getToneInitial: (tone) => presenter.getToneInitial(tone),
  };
};
