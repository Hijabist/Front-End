import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { predictApiService } from "../../data/remote/predictApi";

export class AnalysisPresenter {
  constructor() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.analysisResults = null;
    this.isLoading = false;
    this.isAnalyzing = false;
    this.isCameraOpen = false;
    this.captureMode = "upload";
    this.currentStream = null;
    this.progressValue = 0;
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
        description: "Please select or capture an image first.",
      });
      return;
    }

    try {
      this.isAnalyzing = true;
      this.progressValue = 0;

      console.log("🎬 Starting image analysis...");

      this.toast({
        title: "Analysis Started",
        description: "Analyzing your image with AI...",
      });

      const progressInterval = setInterval(() => {
        if (this.progressValue < 90) {
          this.progressValue += 10;
        }
      }, 300);

      try {
        const apiResult = await predictApiService.performCombinedAnalysis(
          this.selectedImage
        );

        clearInterval(progressInterval);
        this.progressValue = 100;
        this.analysisResults = apiResult;

        console.log("🎯 Final Analysis Results:", this.analysisResults);

        this.toast({
          title: "Analysis Complete!",
          description: "Your personalized recommendations are ready.",
        });

        setTimeout(() => {
          this.navigate("/combined-results", {
            state: {
              analysisResults: this.analysisResults,
              originalImage: this.imagePreview,
            },
          });
        }, 1000);
      } catch (apiError) {
        clearInterval(progressInterval);
        console.error("API Error:", apiError);

        this.toast({
          variant: "destructive",
          title: "Analysis Failed",
          description:
            apiError.message || "Failed to analyze image. Please try again.",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      this.toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "An unexpected error occurred during analysis.",
      });
    } finally {
      this.isAnalyzing = false;
    }
  }

  getAnalysisProgress() {
    return this.progressValue;
  }

  setVideoElement(videoElement) {
    this.videoElement = videoElement;
  }

  setCaptureMode(mode) {
    this.captureMode = mode;
  }

  async openCamera() {
    try {
      this.isLoading = true;
      this.isCameraOpen = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      this.currentStream = stream;
      this.isLoading = false;

      this.toast({
        title: "Camera Activated",
        description: "Camera is ready. Position your face and capture when ready.",
      });

      return stream;
    } catch (error) {
      this.isLoading = false;
      this.isCameraOpen = false;
      console.error("Error accessing camera:", error);

      let errorMessage = "Failed to access camera";
      if (error.name === "NotAllowedError") {
        errorMessage = "Camera access denied. Please allow camera permission and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      }

      this.toast({
        variant: "destructive",
        title: "Camera Error",
        description: errorMessage,
      });

      throw error;
    }
  }

  closeCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
    this.isCameraOpen = false;
  }

  capturePhoto(videoElement, canvasElement) {
    if (!videoElement || !canvasElement) return;

    const context = canvasElement.getContext("2d");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0);

    canvasElement.toBlob(
      (blob) => {
        this.selectedImage = new File([blob], "captured-photo.jpg", {
          type: "image/jpeg",
        });
        this.imagePreview = URL.createObjectURL(blob);
      },
      "image/jpeg",
      0.8
    );

    this.closeCamera();
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
        description: "Please select an image smaller than 10MB.",
      });
      return;
    }

    this.selectedImage = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  handleImageSelection(file) {
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);

    this.toast({
      title: "Image Selected",
      description: "Image has been selected for analysis.",
    });
  }

  removeImage() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
    this.selectedImage = null;
    this.imagePreview = null;
    this.analysisResults = null;
  }

  isCameraSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  resetAnalysis() {
    this.removeImage();
    this.closeCamera();
    this.isAnalyzing = false;
    this.progressValue = 0;
  }
}

export const useAnalysisPresenter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureMode, setCaptureMode] = useState("upload");
  const [analysisResults, setAnalysisResults] = useState(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const presenter = new AnalysisPresenter();
  presenter.selectedImage = selectedImage;
  presenter.imagePreview = imagePreview;
  presenter.isLoading = isLoading;
  presenter.isAnalyzing = isAnalyzing;
  presenter.isCameraOpen = isCameraOpen;
  presenter.captureMode = captureMode;
  presenter.analysisResults = analysisResults;
  presenter.init(navigate, toast);

  return {
    selectedImage,
    imagePreview,
    isLoading,
    isAnalyzing,
    isCameraOpen,
    captureMode,
    analysisResults,

    setCaptureMode: (mode) => {
      setCaptureMode(mode);
      presenter.setCaptureMode(mode);
    },

    openCamera: async () => {
      setIsLoading(true);
      try {
        const stream = await presenter.openCamera();
        setIsCameraOpen(true);
        setIsLoading(false);
        return stream;
      } catch (error) {
        setIsCameraOpen(false);
        setIsLoading(false);
        throw error;
      }
    },

    closeCamera: () => {
      presenter.closeCamera();
      setIsCameraOpen(false);
    },

    capturePhoto: (videoElement, canvasElement) => {
      presenter.capturePhoto(videoElement, canvasElement);
      setSelectedImage(presenter.selectedImage);
      setImagePreview(presenter.imagePreview);
      setIsCameraOpen(false);
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

    isCameraSupported: () => presenter.isCameraSupported(),

    resetAnalysis: () => {
      presenter.resetAnalysis();
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResults(null);
      setIsAnalyzing(false);
      setIsCameraOpen(false);
      setCaptureMode("upload");
    },

    getAnalysisProgress: () => presenter.getAnalysisProgress(),

    setVideoElement: (videoElement) => presenter.setVideoElement(videoElement),
  };
};
