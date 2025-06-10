import React, { useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  ImageIcon, 
  RefreshCw,
  Sparkles,
  Eye,
  CheckCircle 
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAnalysisPresenter } from "./AnalysisPresenter";

export default function Analysis() {
  const {
    selectedImage,
    imagePreview,
    isLoading,
    isAnalyzing,
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
    getAnalysisProgress
  } = useAnalysisPresenter();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle camera opening
  const handleOpenCamera = async () => {
    try {
      const stream = await openCamera();
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to open camera:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, [closeCamera]);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      capturePhoto(videoRef.current, canvasRef.current);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Skin Tone Analysis</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use your camera or upload a photo to analyze your skin tone and get 
              perfect hijab color recommendations
            </p>
          </div>

          {/* Photo Capture Tabs */}
          {!selectedImage && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-400" />
                  Choose Photo Method
                </CardTitle>
                <CardDescription>
                  Select whether you want to use camera or upload photo from gallery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="camera" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="camera">Camera</TabsTrigger>
                    <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                  </TabsList>
                  
                  {/* Camera Tab */}
                  <TabsContent value="camera" className="space-y-4">
                    {!isCameraSupported() ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Camera is not available on this device. Please use the upload option.
                        </p>
                      </div>
                    ) : (
                      <>
                        {!isCameraOpen ? (
                          <div className="text-center py-8">
                            <Camera className="h-16 w-16 text-rose-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Take a Photo</h3>
                            <p className="text-muted-foreground mb-6">
                              Use your device camera to capture a photo for analysis
                            </p>
                            <Button
                              onClick={handleOpenCamera}
                              disabled={isLoading}
                              className="bg-rose-400 hover:bg-rose-500"
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
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative bg-black rounded-lg overflow-hidden">
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full max-w-md mx-auto rounded-lg block"
                                style={{ aspectRatio: '4/3' }}
                              />
                              <canvas
                                ref={canvasRef}
                                className="hidden"
                              />
                              
                              {/* Camera overlay guide */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="border-2 border-white border-dashed rounded-full w-48 h-48 opacity-75"></div>
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                                  Position your face in the circle
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-4">
                                Position your face in the center and ensure good lighting
                              </p>
                              <div className="flex justify-center gap-4">
                                <Button variant="outline" onClick={closeCamera}>
                                  Close Camera
                                </Button>
                                <Button
                                  onClick={handleCaptureClick}
                                  className="bg-rose-400 hover:bg-rose-500"
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Capture Photo
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>

                  {/* Upload Tab */}
                  <TabsContent value="upload" className="space-y-4">
                    <div className="text-center py-8">
                      <Upload className="h-16 w-16 text-rose-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Photo</h3>
                      <p className="text-muted-foreground mb-6">
                        Select a photo from your device gallery
                      </p>
                      <Button
                        onClick={openFileDialog}
                        className="bg-rose-400 hover:bg-rose-500"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Selected Image Preview */}
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
                    className="max-w-sm w-full rounded-lg shadow-md mb-4"
                  />
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={removeImage}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="bg-rose-400 hover:bg-rose-500"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Analyze Now
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
                  <h3 className="text-lg font-medium mb-2">Analyzing Your Photo</h3>
                  <p className="text-muted-foreground mb-4">
                    Our AI is analyzing your skin tone and providing the best recommendations...
                  </p>
                  <Progress value={getAnalysisProgress()} className="w-full max-w-md mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {getAnalysisProgress()}% complete
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