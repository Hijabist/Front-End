import React, { useRef, useState, useEffect } from "react";
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
  const {
    selectedImage,
    imagePreview,
    isAnalyzing,
    isLoading,
    handleFileUpload,
    removeImage,
    analyzeImage,
    resetAnalysis,
    getAnalysisProgress,
    setCaptureMode,
  } = useAnalysisPresenter();

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // ✅ Atur kamera berdasarkan state cameraActive dan saat komponen unmount
  useEffect(() => {
    let localStream;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        localStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        alert("Camera access failed. Please allow camera permission.");
      }
    };

    if (cameraActive) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCaptureMode("upload");
      handleFileUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleActivateCamera = () => {
    setCaptureMode("camera");
    setCameraActive(true);
  };

  const stopCamera = () => {
    setCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
        handleFileUpload(file);
        stopCamera();
      }
    }, "image/jpeg");
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
              Upload your photo or take a picture to get personalized hijab
              color recommendations based on your face shape and skin tone
              analysis.
            </p>
          </div>

          {/* Upload vs Kamera Pilihan */}
          {!selectedImage && !cameraActive && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-400" />
                  Choose Image Source
                </CardTitle>
                <CardDescription>
                  Upload from gallery or use your camera
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-rose-400 transition-colors">
                  <Upload className="h-16 w-16 text-rose-400 mx-auto mb-4" />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={openFileDialog}
                      className="bg-rose-400 hover:bg-rose-500 flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button
                      onClick={handleActivateCamera}
                      className="bg-blue-500 hover:bg-blue-600 flex-1"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Capture with Camera
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported formats: JPG, PNG, WEBP (Max: 10MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Kamera Aktif */}
          {cameraActive && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                  Camera Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <video
                  ref={videoRef}
                  className="rounded-lg shadow-md mb-4 w-full max-w-md h-auto"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="flex gap-4">
                  <Button
                    onClick={captureImage}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    📸 Capture
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>
          )}

          {/* Gambar yang sudah dipilih */}
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
                  <img
                    src={imagePreview}
                    alt="Selected for analysis"
                    className="max-w-sm w-full rounded-lg shadow-md mb-4 border-2 border-gray-200"
                  />
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

          {/* Progress */}
          {isAnalyzing && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-400 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium mb-2">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Analyzing your face shape and skin tone...
                  </p>
                  <Progress
                    value={getAnalysisProgress()}
                    className="w-full max-w-md mx-auto mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {getAnalysisProgress()}% complete
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Tips for Best Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Lighting</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use bright natural light</li>
                    <li>• Avoid harsh shadows</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Photo Position</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Face camera directly</li>
                    <li>• Stay 30–50cm from camera</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hidden input */}
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
