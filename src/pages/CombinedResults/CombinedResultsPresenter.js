import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import {
  getGroupDisplayName,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from "../../data";

class CombinedResultsPresenter {
  constructor(navigate, toast, location) {
    this.navigate = navigate;
    this.toast = toast;
    this.location = location;
    this.init();
  }

  init() {
    this.isSaved = false;
    this.isLoggedIn = false;
    this.selectedVideo = null;
    this.showVideoModal = false;
    this.sortedProbabilities = [];

    this.checkAuthAndLoadData();
  }

  checkAuthAndLoadData() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.isLoggedIn = !!currentUser;

    const state = this.location.state;
    if (!state || !state.analysisResults) {
      this.toast({
        variant: "destructive",
        title: "No analysis data",
        description: "Please analyze an image first.",
      });
      this.navigate("/analysis");
      return;
    }
    const { analysisResults, originalImage } = state;

    // Validasi data sebelum mapping
    if (!analysisResults?.faceShape || !analysisResults?.skinTone) {
      this.toast({
        variant: "destructive",
        title: "Invalid analysis data",
        description: "Analysis data is incomplete. Please try analyzing again.",
      });
      this.navigate("/analysis");
      return;
    }

    // Map data structure dari API ke format yang digunakan di UI
    this.faceShapeData = {
      result: {
        predicted_face_shape: analysisResults.faceShape.type || "unknown",
        confidence: analysisResults.faceShape.confidence || 0,
        all_probabilities: analysisResults.faceShape.allProbabilities || {},
        hijabRecomendation: {
          recommendations: analysisResults.faceShape.recommendations || [],
          total_recommendations: (
            analysisResults.faceShape.recommendations || []
          ).length,
          face_shape: analysisResults.faceShape.type || "unknown",
        },
      },
    };

    this.skinToneData = {
      skin_tone: analysisResults.skinTone.type || "unknown",
      recommended_groups: analysisResults.skinTone.recommendedGroups || [],
      confidence: analysisResults.skinTone.confidence || 0,
    };

    this.uploadedImage = originalImage;

    this.calculateSortedProbabilities();
  }
  calculateSortedProbabilities() {
    if (this.faceShapeData?.result?.all_probabilities) {
      this.sortedProbabilities = Object.entries(
        this.faceShapeData.result.all_probabilities
      ).sort(([, a], [, b]) => b.probability - a.probability);
    } else {
      console.warn("No face shape probabilities found");
      this.sortedProbabilities = [];
    }
  }

  handleVideoClick(url) {
    this.selectedVideo = url;
    this.showVideoModal = true;
  }

  closeVideoModal() {
    this.showVideoModal = false;
    this.selectedVideo = null;
  }

  handleSaveAnalysis() {
    if (!this.isLoggedIn) {
      this.toast({
        title: "Login required",
        description: "Please login or register to save your analysis results.",
        action: (
          <button
            className="border border-rose-500 text-rose-500 hover:bg-rose-50 px-3 py-1 rounded text-sm"
            onClick={() => this.navigate("/login")}
          >
            Login
          </button>
        ),
      });
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const analysisData = {
      id: Date.now().toString(),
      date: Date.now(),
      faceShape: this.faceShapeData.result.predicted_face_shape,
      confidence: this.faceShapeData.result.confidence,
      skinTone: this.skinToneData.skin_tone,
      colorGroups: this.skinToneData.recommended_groups,
      recommendations:
        this.faceShapeData.result.hijabRecomendation.recommendations,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        const savedAnalyses = u.savedAnalyses || [];
        return {
          ...u,
          savedAnalyses: [...savedAnalyses, analysisData],
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    this.isSaved = true;

    this.toast({
      title: "Analysis saved",
      description:
        "Your complete analysis results have been saved to your profile.",
    });
  }

  navigateToAnalysis() {
    this.navigate("/analysis");
  }

  shareResults() {
    if (navigator.share) {
      navigator.share({
        title: "My Hijab Analysis Results",
        text: `Check out my personalized hijab analysis! Face shape: ${this.faceShapeData.result.predicted_face_shape}, Skin tone: ${this.skinToneData.skin_tone}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.toast({
        title: "Link copied",
        description: "Results link has been copied to your clipboard.",
      });
    }
  }

  getGroupDisplayName(group) {
    return getGroupDisplayName(group);
  }

  getYouTubeThumbnail(url) {
    return getYouTubeThumbnail(url);
  }

  getYouTubeEmbedUrl(url) {
    return getYouTubeEmbedUrl(url);
  }
}

export function useCombinedResultsPresenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [presenter] = useState(
    () => new CombinedResultsPresenter(navigate, toast, location)
  );
  const [, forceUpdate] = useState({});

  const triggerUpdate = () => forceUpdate({});

  useEffect(() => {
    presenter.update = triggerUpdate;
  }, [presenter]);

  // Pastikan data ter-load dengan benar
  if (!presenter.faceShapeData || !presenter.skinToneData) {
    return {
      presenter: null,
      faceShapeData: null,
      skinToneData: null,
      uploadedImage: null,
      isSaved: false,
      isLoggedIn: false,
      selectedVideo: null,
      showVideoModal: false,
      sortedProbabilities: [],
      handleVideoClick: () => {},
      closeVideoModal: () => {},
      handleSaveAnalysis: () => {},
      navigateToAnalysis: () => {},
      shareResults: () => {},
      getGroupDisplayName: () => "",
      getYouTubeThumbnail: () => "",
      getYouTubeEmbedUrl: () => "",
    };
  }

  return {
    presenter,
    faceShapeData: presenter.faceShapeData,
    skinToneData: presenter.skinToneData,
    uploadedImage: presenter.uploadedImage,
    isSaved: presenter.isSaved,
    isLoggedIn: presenter.isLoggedIn,
    selectedVideo: presenter.selectedVideo,
    showVideoModal: presenter.showVideoModal,
    sortedProbabilities: presenter.sortedProbabilities,

    handleVideoClick: (url) => {
      presenter.handleVideoClick(url);
      triggerUpdate();
    },
    closeVideoModal: () => {
      presenter.closeVideoModal();
      triggerUpdate();
    },
    handleSaveAnalysis: () => {
      presenter.handleSaveAnalysis();
      triggerUpdate();
    },
    navigateToAnalysis: () => presenter.navigateToAnalysis(),
    shareResults: () => presenter.shareResults(),

    getGroupDisplayName: presenter.getGroupDisplayName.bind(presenter),
    getYouTubeThumbnail: presenter.getYouTubeThumbnail.bind(presenter),
    getYouTubeEmbedUrl: presenter.getYouTubeEmbedUrl.bind(presenter),
  };
}

export default CombinedResultsPresenter;
