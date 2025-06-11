import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { predictApiService } from "../../data/remote/predictApi";

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
  
  async loadSavedAnalyses() {
    try {
      this.isLoading = true;
      const profileData = await predictApiService.fetchUserProfile();

      // Konversi timestamp Firebase ke ISO string
      const timestampSeconds = profileData.faceShape?.updatedAt?._seconds;
      const timestampDate = timestampSeconds
        ? new Date(timestampSeconds * 1000).toISOString()
        : new Date().toISOString();

      this.lastAnalysis = {
        id: profileData.faceShape?.uid ?? "latest",
        faceShape: profileData.faceShape?.predicted_face_shape ?? "Unknown",
        skinTone: profileData.skinTone?.skin_tone ?? "Unknown",
        confidence: profileData.faceShape?.confidence
          ? `${Math.round(profileData.faceShape.confidence * 100)}%`
          : "N/A",
        date: timestampDate,
        colorGroups:
          profileData.skinTone?.color_recommendation?.recommended_groups?.map(
            (g) => g.group
          ) ?? [],
        recommendations:
          profileData.faceShape?.hijabRecomendation?.recommendations ?? [],
      };

      console.log("✅ Profile data loaded:", this.lastAnalysis);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      this.lastAnalysis = null;
    } finally {
      this.isLoading = false;
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
}

export const useProfilePresenter = () => {
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();
  const authContext = useAuth();
  
  const [presenter] = useState(() => new ProfilePresenter());

  // Initialize presenter
  useEffect(() => {
    presenter.init(navigate, toast, authContext);
  }, [navigate, toast, authContext]);

  // Load data when user is available
  useEffect(() => {
    if (authContext.user) {
      const loadData = async () => {
        await presenter.loadSavedAnalyses();
        setLastAnalysis(presenter.lastAnalysis);
        setIsLoading(presenter.isLoading);
      };
      
      loadData();
    }
  }, [authContext.user, presenter]);

  return {
    user: authContext.user,
    lastAnalysis,
    isLoading,
    handleLogout: () => presenter.handleLogout(),
    handleViewAnalysis: (analysisId) => presenter.handleViewAnalysis(analysisId),
    formatDate: (date) => presenter.formatDate(date),
    formatTime: (time) => presenter.formatTime(time),
    getShapeInitial: (shape) => presenter.getShapeInitial(shape),
    getToneInitial: (tone) => presenter.getToneInitial(tone),
  };
};