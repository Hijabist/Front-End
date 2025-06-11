import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import {
  Camera,
  Upload,
  X,
  Loader2,
  ImageIcon,
  RefreshCw,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAnalysisPresenter } from "./AnalysisPresenter";

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedImage,
    imagePreview,
    isAnalyzing,
    isLoading,
    isCameraOpen,
    captureMode,
    setCaptureMode,
    openCamera,
    closeCamera,
    capturePhoto,
    handleFileUpload,
    removeImage,
    analyzeImage,
    isCameraSupported,
    resetAnalysis,
    getAnalysisProgress,
  } = useAnalysisPresenter();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Handle camera stream setup
  useEffect(() => {
    if (isCameraOpen && videoRef.current && !videoRef.current.srcObject) {
      openCamera().then((stream) => {
        videoRef.current.srcObject = streamRef.current;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .then(() => {
            })
            .catch((error) => {
              console.error("Error playing video:", error); // ✅ log 8
            });
        };
      });
    }
  }, [isCameraOpen]);

  // Cleanup camera when component unmounts or navigates
  useEffect(() => {
    const cleanup = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isCameraOpen) {
        cleanup();
        closeCamera();
      }
    };

    const handleBeforeUnload = () => {
      cleanup();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      cleanup();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isCameraOpen, closeCamera]);

  // Additional cleanup for route changes
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [location.pathname]);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      capturePhoto(videoRef.current, canvasRef.current);
      // Close camera after capture
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleOpenCamera = async () => {
    setCaptureMode("camera");
    try {
      const stream = await openCamera();
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .then(() => {
              console.log("Video playing...");
            })
            .catch((error) => {
              console.error("Error playing video:", error);
            });
        };
      }
    } catch (error) {
      console.error("Failed to open camera:", error);
    }
  };

  const handleCloseCamera = () => {
    closeCamera();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleChooseUpload = () => {
    setCaptureMode("upload");
    openFileDialog();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">AI Color Analysis</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Capture or upload your photo to get personalized hijab color
              recommendations based on your face shape and skin tone analysis
            </p>
          </div>

          {/* Photo Capture Options - Only show when no image selected */}
          {!selectedImage && !isCameraOpen && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-400" />
                  Choose Photo Method
                </CardTitle>
                <CardDescription>
                  Select one method to provide your photo for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Camera Option */}
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-rose-400 transition-colors">
                    <Camera className="h-16 w-16 text-rose-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Take a Photo</h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Use your device camera to capture a photo for analysis
                    </p>
                    {!isCameraSupported() ? (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                        <p className="text-xs text-yellow-800">
                          Camera is not available on this device
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleOpenCamera}
                        disabled={isLoading || !isCameraSupported()}
                        className="bg-rose-400 hover:bg-rose-500 w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Opening Camera...
                          </>
                        ) : (
                          <>
                            <Camera className="h-4 w-4 mr-2" />
                            Open Camera
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Upload Option */}
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-rose-400 transition-colors">
                    <Upload className="h-16 w-16 text-rose-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Upload Your Photo
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Select a clear photo from your device gallery for analysis
                    </p>
                    <Button
                      onClick={handleChooseUpload}
                      className="bg-rose-400 hover:bg-rose-500 w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Supported formats: JPG, PNG, WEBP (Max: 10MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Camera View */}
          {isCameraOpen && !selectedImage && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-rose-400" />
                  Camera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden mx-auto max-w-md">
                    <video
                      key={isCameraOpen}
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      width="640"
                      height="480"
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        transform: "scaleX(-1)",
                        borderRadius: "8px",
                      }}
                    />

                    <canvas ref={canvasRef} className="hidden" />

                    {/* Camera overlay guide */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-2 border-white border-dashed rounded-full w-32 h-32 md:w-48 md:h-48 opacity-75"></div>
                    </div>

                    {/* Instruction overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs md:text-sm bg-black bg-opacity-60 px-3 py-2 rounded-lg">
                      Position your face in the circle
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Position your face in the center and ensure good lighting
                      for best results
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handleCloseCamera}
                        className="order-2 sm:order-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Close Camera
                      </Button>
                      <Button
                        onClick={handleCaptureClick}
                        className="bg-rose-400 hover:bg-rose-500 order-1 sm:order-2"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Capture Photo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Image Preview with Analysis Button */}
          {selectedImage && imagePreview && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-rose-400" />
                    Selected Photo
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Selected for analysis"
                      className="max-w-sm w-full rounded-lg shadow-md mb-4 border-2 border-gray-200"
                    />
                    {/* Image quality indicator */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Ready for Analysis
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <Button
                      variant="outline"
                      onClick={removeImage}
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="bg-rose-400 hover:bg-rose-500 flex-1"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Our advanced AI is analyzing your face shape and skin tone
                    to provide personalized hijab color recommendations...
                  </p>
                  <Progress
                    value={getAnalysisProgress()}
                    className="w-full max-w-md mx-auto mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {getAnalysisProgress()}% complete • Processing image
                    features
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Tips for Best Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Lighting</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use bright natural light</li>
                    <li>• Avoid direct harsh lighting</li>
                    <li>• Ensure face is not covered by shadows</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Photo Position</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Face directly towards the camera</li>
                    <li>• Distance about 30-50 cm from camera</li>
                    <li>• Ensure face is clear and in focus</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
