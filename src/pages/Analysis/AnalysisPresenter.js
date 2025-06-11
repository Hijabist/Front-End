import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { predictApiService } from "../../data/remote/predictApi";

export class AnalysisPresenter {
  constructor() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.analysisResults = null;
    this.isAnalyzing = false;
    this.progressValue = 0;
    this.captureMode = "upload";
    this.navigate = null;
    this.toast = null;
  }

  init(navigate, toast) {
    this.navigate = navigate;
    this.toast = toast;
  }

  async analyzeImage() {
    if (!this.selectedImage) {
      this.toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please upload or capture an image first.",
      });
      return;
    }

    this.isAnalyzing = true;
    this.progressValue = 0;

    const progressInterval = setInterval(() => {
      if (this.progressValue < 90) {
        this.progressValue += 10;
      }
    }, 300);

    try {
      this.toast({
        title: "Analysis Started",
        description: "Analyzing image...",
      });
      const apiResult = await predictApiService.performCombinedAnalysis(
        this.selectedImage
      );
      clearInterval(progressInterval);
      this.progressValue = 100;
      this.analysisResults = apiResult;

      this.toast({
        title: "Analysis Complete",
        description: "Recommendations are ready.",
      });

      setTimeout(() => {
        this.navigate("/combined-results", {
          state: {
            analysisResults: this.analysisResults,
            originalImage: this.imagePreview,
          },
        });
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      this.toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Something went wrong.",
      });
    } finally {
      this.isAnalyzing = false;
    }
  }

  getAnalysisProgress() {
    return this.progressValue;
  }

  setCaptureMode(mode) {
    this.captureMode = mode;
  }

  handleFileUpload(file) {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      this.toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a valid image file (JPG, PNG, WEBP).",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Image must be less than 10MB.",
      });
      return;
    }

    this.selectedImage = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  removeImage() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
    this.selectedImage = null;
    this.imagePreview = null;
    this.analysisResults = null;
  }

  resetAnalysis() {
    this.removeImage();
    this.isAnalyzing = false;
    this.progressValue = 0;
    this.captureMode = "upload";
  }
}

export const useAnalysisPresenter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [captureMode, setCaptureMode] = useState("upload");

  const navigate = useNavigate();
  const { toast } = useToast();

  const presenter = new AnalysisPresenter();
  presenter.selectedImage = selectedImage;
  presenter.imagePreview = imagePreview;
  presenter.isAnalyzing = isAnalyzing;
  presenter.analysisResults = analysisResults;
  presenter.captureMode = captureMode;
  presenter.init(navigate, toast);

  return {
    selectedImage,
    imagePreview,
    isAnalyzing,
    captureMode,
    analysisResults,

    setCaptureMode: (mode) => {
      setCaptureMode(mode);
      presenter.setCaptureMode(mode);
    },

    handleFileUpload: (file) => {
      presenter.handleFileUpload(file);
      setSelectedImage(presenter.selectedImage);
      setImagePreview(presenter.imagePreview);
    },

    removeImage: () => {
      presenter.removeImage();
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResults(null);
    },

    analyzeImage: async () => {
      setIsAnalyzing(true);
      try {
        await presenter.analyzeImage();
        setAnalysisResults(presenter.analysisResults);
      } finally {
        setIsAnalyzing(false);
      }
    },

    resetAnalysis: () => {
      presenter.resetAnalysis();
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResults(null);
      setIsAnalyzing(false);
      setCaptureMode("upload");
    },

    getAnalysisProgress: () => presenter.getAnalysisProgress(),
  };
};
