import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

export class AnalysisPresenter {
  constructor() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.isLoading = false;
    this.isAnalyzing = false;
    this.isCameraOpen = false;
    this.analysisResults = null;
    this.captureMode = 'upload';
    this.stream = null;
    this.videoElement = null; // Add this to store video element reference
  }

  init(navigate, toast) {
    this.navigate = navigate;
    this.toast = toast;
  }

  // Set video element reference
  setVideoElement(videoElement) {
    this.videoElement = videoElement;
  }

  // Switch between upload and camera mode
  setCaptureMode(mode) {
    this.captureMode = mode;
  }

  // Open camera
  async openCamera() {
    try {
      this.isLoading = true;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      this.stream = stream;
      this.isCameraOpen = true;
      this.isLoading = false;
      
      // If video element is available, assign stream immediately
      if (this.videoElement) {
        this.videoElement.srcObject = stream;
      }
      
      this.toast({
        title: "Camera Ready",
        description: "Camera is now active. Position your face and capture when ready.",
      });
      
      return stream;
    } catch (error) {
      this.isLoading = false;
      this.isCameraOpen = false;
      console.error('Error accessing camera:', error);
      
      let errorMessage = 'Failed to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permission and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      
      this.toast({
        variant: "destructive",
        title: "Camera Error",
        description: errorMessage,
      });
      
      throw error;
    }
  }

  // Close camera
  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.isCameraOpen = false;
    
    this.toast({
      title: "Camera Closed",
      description: "Camera has been turned off.",
    });
  }

  // Capture photo from camera
  capturePhoto(videoElement, canvasElement) {
    try {
      if (!videoElement || !canvasElement) {
        throw new Error('Video or canvas element not found');
      }

      // Check if video is actually playing
      if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
        throw new Error('Video not ready for capture');
      }

      const context = canvasElement.getContext('2d');
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      
      // Draw the video frame to canvas
      context.drawImage(videoElement, 0, 0);
      
      // Convert canvas to blob
      canvasElement.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          this.handleImageSelection(file);
          this.closeCamera();
          
          this.toast({
            title: "Photo Captured!",
            description: "Photo has been captured successfully.",
          });
        }
      }, 'image/jpeg', 0.9);
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      this.toast({
        variant: "destructive",
        title: "Capture Error",
        description: "Failed to capture photo. Please try again.",
      });
    }
  }

  // Handle file upload
  handleFileUpload(file) {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please select a valid image file.",
      });
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
      });
      return;
    }
    
    this.handleImageSelection(file);
  }

  // Handle image selection (from upload or camera)
  handleImageSelection(file) {
    this.selectedImage = file;
    
    // Create preview URL
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

  // Remove selected image
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.analysisResults = null;
    
    this.toast({
      title: "Image Removed",
      description: "Selected image has been removed.",
    });
  }

  // Analyze the selected image
  async analyzeImage() {
    if (!this.selectedImage) {
      this.toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please select an image first.",
      });
      return;
    }

    this.isAnalyzing = true;

    try {
      this.toast({
        title: "Analyzing Image...",
        description: "Please wait while we analyze your skin tone.",
      });

      // Simulate API call - replace with actual analysis
      await this.performSkinToneAnalysis(this.selectedImage);
      
      this.toast({
        title: "Analysis Complete!",
        description: "Your skin tone analysis is ready.",
      });

      // Navigate to results page with analysis data
      this.navigate('/results', { 
        state: { 
          analysisResults: this.analysisResults,
          originalImage: this.imagePreview 
        } 
      });

    } catch (error) {
      console.error('Analysis error:', error);
      this.toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze image. Please try again.",
      });
    } finally {
      this.isAnalyzing = false;
    }
  }

  // Perform skin tone analysis (mock implementation)
  async performSkinToneAnalysis(imageFile) {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results - replace with actual AI analysis
    const mockResults = {
      skinTone: {
        dominant: 'warm',
        undertone: 'yellow',
        category: 'medium',
        confidence: 0.85
      },
      recommendedColors: [
        { name: 'Coral Pink', hex: '#FF6B6B', match: 92 },
        { name: 'Warm Beige', hex: '#D4A574', match: 89 },
        { name: 'Soft Peach', hex: '#FFAB91', match: 87 },
        { name: 'Dusty Rose', hex: '#D4A5A5', match: 85 }
      ],
      analysis: {
        processedAt: new Date().toISOString(),
        imageQuality: 'good',
        lightingCondition: 'natural'
      }
    };
    
    this.analysisResults = mockResults;
    return mockResults;
  }

  // Check if camera is supported
  isCameraSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // Reset analysis state
  resetAnalysis() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.analysisResults = null;
    this.isAnalyzing = false;
    this.closeCamera();
    this.captureMode = 'upload';
  }

  // Get analysis progress
  getAnalysisProgress() {
    if (!this.isAnalyzing) return 0;
    return 75;
  }
}

export const useAnalysisPresenter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureMode, setCaptureMode] = useState('upload');
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
      setCaptureMode('upload');
    },
    
    getAnalysisProgress: () => presenter.getAnalysisProgress(),
    
    // Add method to set video element reference
    setVideoElement: (videoElement) => presenter.setVideoElement(videoElement)
  };
};