import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";


export class ProfilePresenter {
  constructor() {
    this.lastAnalysis = null;
    this.isLoading = true;
  }
  init(navigate, toast, authContext) {
    this.navigate = navigate;
    this.toast = toast;
    this.authContext = authContext;
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
  }  // Load saved analyses and set last analysis
  loadSavedAnalyses() {
    // Mock data - replace with actual data loading
    const analyses = [
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

    // Set the most recent analysis as last analysis
    if (analyses.length > 0) {
      this.lastAnalysis = analyses[0]; // Most recent one
    }
  }
}

export const useProfilePresenter = () => {
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();
  const authContext = useAuth();
  const presenter = new ProfilePresenter();
  presenter.lastAnalysis = lastAnalysis;
  presenter.isLoading = isLoading;
  presenter.init(navigate, toast, authContext);  // Initialize data when component mounts
  useEffect(() => {
    if (authContext.user) {
      // Load saved analyses
      presenter.loadSavedAnalyses();
      setLastAnalysis(presenter.lastAnalysis);

      setIsLoading(false);
    }
  }, [authContext.user]);  return {
    user: authContext.user,
    lastAnalysis,
    isLoading,
    handleLogout: () => presenter.handleLogout(),
    handleViewAnalysis: (analysisId) =>
      presenter.handleViewAnalysis(analysisId),
    formatDate: (date) => presenter.formatDate(date),
    formatTime: (time) => presenter.formatTime(time),
    getShapeInitial: (shape) => presenter.getShapeInitial(shape),
    getToneInitial: (tone) => presenter.getToneInitial(tone),
  };
};
