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

      // Cek apakah ada data yang valid
      if (!profileData || (!profileData.faceShape && !profileData.skinTone)) {
        console.warn("⚠️ No profile data available");
        this.lastAnalysis = null;
        return;
      }

      // Konversi timestamp Firebase ke ISO string - prioritas ke updatedAt terbaru
      let latestTimestamp = null;
      
      if (profileData.faceShape?.updatedAt?._seconds) {
        latestTimestamp = profileData.faceShape.updatedAt._seconds;
      }
      
      if (profileData.skinTone?.updatedAt?._seconds) {
        const skinToneTimestamp = profileData.skinTone.updatedAt._seconds;
        if (!latestTimestamp || skinToneTimestamp > latestTimestamp) {
          latestTimestamp = skinToneTimestamp;
        }
      }

      const timestampDate = latestTimestamp
        ? new Date(latestTimestamp * 1000).toISOString()
        : new Date().toISOString();

      // Mapping data sesuai struktur API response yang sebenarnya
      this.lastAnalysis = {
        id: profileData.faceShape?.uid || profileData.skinTone?.uid || "latest",
        faceShape: profileData.faceShape?.predicted_face_shape || "Unknown",
        skinTone: profileData.skinTone?.color_recommendation?.skin_tone || "Unknown",
        confidence: profileData.faceShape?.confidence
          ? `${Math.round(profileData.faceShape.confidence * 100)}%`
          : "N/A",
        date: timestampDate,
        
        // Color groups dari skin tone recommendation
        colorGroups: profileData.skinTone?.color_recommendation?.recommended_groups?.map(
          (group) => group.group
        ) || [],
        
        // Recommendations dari face shape
        recommendations: profileData.faceShape?.hijabRecomendation?.recommendations || [],
        
        // Data tambahan untuk detail
        allProbabilities: profileData.faceShape?.all_probabilities || {},
        totalRecommendations: profileData.faceShape?.hijabRecomendation?.total_recommendations || 0,
        recommendedGroups: profileData.skinTone?.color_recommendation?.recommended_groups || [],
        
        // Data user
        userInfo: {
          uid: profileData.user?.uid || "",
          email: profileData.user?.email || "",
          displayName: profileData.user?.displayName || "",
        }
      };

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
    // Navigate ke combined results dengan data analysis
    this.navigate("/combined-results", {
      state: {
        analysisResults: {
          faceShape: {
            type: this.lastAnalysis.faceShape,
            confidence: parseFloat(this.lastAnalysis.confidence.replace('%', '')) / 100,
            allProbabilities: this.lastAnalysis.allProbabilities,
            recommendations: this.lastAnalysis.recommendations,
            description: `Recommended hijab styles for ${this.lastAnalysis.faceShape} face.`,
          },
          skinTone: {
            type: this.lastAnalysis.skinTone,
            recommendedGroups: this.lastAnalysis.recommendedGroups,
            confidence: 0.8,
          },
          timestamp: this.lastAnalysis.date,
        },
        originalImage: null, // Tidak ada gambar tersimpan
      },
    });
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
    if (!skinTone) return "S";
    // Handle "mid dark" case dari API
    const words = skinTone.split(" ");
    if (words.length > 1) {
      return words.map(word => word.charAt(0).toUpperCase()).join("");
    }
    return skinTone.charAt(0).toUpperCase();
  }

  // Helper untuk format skin tone display
  formatSkinTone(skinTone) {
    if (!skinTone) return "Unknown";
    // Capitalize each word: "mid dark" -> "Mid Dark"
    return skinTone
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
  }, [navigate, toast, authContext, presenter]);

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
    formatSkinTone: (tone) => presenter.formatSkinTone(tone),
  };
};