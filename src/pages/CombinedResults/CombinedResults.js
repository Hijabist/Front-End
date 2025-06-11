import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { ArrowLeft, ExternalLink, Play, Share2, Save, Upload, Palette, User, X } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useCombinedResultsPresenter } from "./CombinedResultsPresenter"

export default function CombinedResults() {
  const {
    faceShapeData,
    skinToneData,
    uploadedImage,
    isSaved,
    isLoggedIn,
    selectedVideo,
    showVideoModal,
    sortedProbabilities,
    handleVideoClick,
    closeVideoModal,
    handleSaveAnalysis,
    navigateToAnalysis,
    shareResults,
    getGroupDisplayName,
    getYouTubeThumbnail,
    getYouTubeEmbedUrl,  } = useCombinedResultsPresenter()

  // Loading state jika data belum tersedia
  if (!faceShapeData || !skinToneData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analysis results...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Link to="/analysis" className="inline-flex items-center gap-2 text-rose-400 mb-4 lg:mb-6 hover:text-rose-500 transition-colors text-sm">
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Back to Analysis</span>
        </Link>

        <div className="space-y-6 lg:space-y-8">
          <div className="text-center space-y-2 lg:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Complete Analysis Results</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Your personalized face shape and skin tone analysis with curated hijab recommendations.
            </p>
          </div>

          {/* Top Row: Face Image Input & Output Highest Percentage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-start">
            {/* Face Image Input */}
            <Card className="flex flex-col h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
              <CardHeader className="pb-2 lg:pb-3 flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                  <Upload className="h-4 w-4 lg:h-5 lg:w-5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">Face Image Input</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">The image used for analysis</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center px-3 sm:px-6 pb-4 lg:pb-6">
                {uploadedImage ? (
                  <div className="w-full h-full flex items-center justify-center min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded face"
                      className="max-h-full max-w-full object-cover rounded-lg border-2 border-rose-200 shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
                    <div className="text-center px-4">
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm sm:text-base">No image uploaded</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Highest Percentage */}
            <Card className="flex flex-col h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] border-2 border-rose-200 bg-rose-50/50">
              <CardHeader className="pb-2 lg:pb-3 flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">Analysis Results</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your predicted face shape and skin tone</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-6 pb-4 lg:pb-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-rose-500 flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold mx-auto mb-3">
                    {faceShapeData.result.predicted_face_shape.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold capitalize leading-tight">
                    <span className="block sm:inline">{faceShapeData.result.predicted_face_shape}</span>
                    <span className="block sm:inline sm:ml-1">Face Shape</span>
                  </h3>                  <p className="text-rose-600 font-medium text-sm sm:text-base lg:text-lg mt-2">
                    Confidence: {(faceShapeData.result.confidence * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold mx-auto mb-3">
                    {skinToneData.skin_tone.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold capitalize leading-tight">
                    <span className="block sm:inline">{skinToneData.skin_tone}</span>
                    <span className="block sm:inline sm:ml-1">Skin Tone</span>
                  </h3>
                  <p className="text-orange-600 font-medium text-sm sm:text-base lg:text-lg mt-2">
                    {skinToneData.recommended_groups.length} Color Groups
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Detailed Analysis</CardTitle>
              <CardDescription className="text-sm lg:text-base">Complete breakdown of face shape probabilities and skin tone analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="face-shape" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-9 lg:h-10">
                  <TabsTrigger value="face-shape" className="text-xs lg:text-sm">Face Shape Analysis</TabsTrigger>
                  <TabsTrigger value="skin-tone" className="text-xs lg:text-sm">Skin Tone Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="face-shape" className="space-y-3 lg:space-y-4 mt-4 lg:mt-6">
                  <h4 className="font-medium mb-3 lg:mb-4 text-sm lg:text-base">Face Shape Probability Distribution</h4>
                  {sortedProbabilities.map(([shape, data], index) => (
                    <div key={shape} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="capitalize font-medium text-sm lg:text-base">{shape}</span>
                          {index === 0 && <Badge variant="secondary" className="text-xs">Predicted</Badge>}
                        </div>
                        <span className="text-xs lg:text-sm font-medium">{data.percentage}</span>
                      </div>
                      <Progress value={data.probability * 100} className="h-2" />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="skin-tone" className="space-y-3 lg:space-y-4 mt-4 lg:mt-6">
                  <h4 className="font-medium mb-3 lg:mb-4 text-sm lg:text-base">Skin Tone: {skinToneData.skin_tone.toUpperCase()}</h4>
                  <p className="text-gray-600 mb-4 text-sm lg:text-base">
                    Based on your skin tone analysis, you have been classified as having a{" "}
                    <strong>{skinToneData.skin_tone}</strong> complexion. This means certain color palettes will be more
                    flattering and enhance your natural beauty.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skinToneData.recommended_groups.map((group, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 lg:p-4">
                        <h5 className="font-medium mb-2 text-sm lg:text-base">{getGroupDisplayName(group.group)}</h5>
                        <p className="text-xs lg:text-sm text-gray-600 mb-3">{group.colors.length} recommended colors</p>
                        <div className="flex flex-wrap gap-1">
                          {group.colors.slice(0, 8).map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-gray-300 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                          {group.colors.length > 8 && (
                            <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs text-gray-600">
                              +{group.colors.length - 8}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Ordered Color Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Palette className="h-4 w-4 lg:h-5 lg:w-5 text-rose-500" />
                Ordered Color Recommendations
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Colors organized by seasonal groups, perfectly matched to your {skinToneData.skin_tone} skin tone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 lg:space-y-8">
                {skinToneData.recommended_groups.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <h3 className="text-base lg:text-lg font-semibold">{getGroupDisplayName(group.group)}</h3>
                      <Badge variant="outline" className="text-xs">{group.colors.length} colors</Badge>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 lg:gap-3">
                      {group.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className="flex flex-col items-center space-y-1 lg:space-y-2">
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-200 shadow-md hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: color }}
                            title={`${getGroupDisplayName(group.group)} - ${color}`}
                          />
                          <span className="text-xs text-gray-500 font-mono hidden sm:block">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Play className="h-4 w-4 lg:h-5 lg:w-5 text-rose-500" />
                Tutorial Videos
              </CardTitle>              <CardDescription className="text-sm lg:text-base">
                {faceShapeData.result.hijabRecomendation.total_recommendations} curated video tutorials perfect for your{" "}
                {faceShapeData.result.hijabRecomendation.face_shape.toLowerCase()} face shape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {faceShapeData.result.hijabRecomendation.recommendations.map((url, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer"
                    onClick={() => handleVideoClick(url)}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video">
                      <img
                        src={getYouTubeThumbnail(url) || "/placeholder.svg"}
                        alt={`Hijab tutorial ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Play className="h-4 w-4 lg:h-5 lg:w-5 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 lg:mt-3 space-y-1 lg:space-y-2">
                      <h4 className="font-medium text-xs lg:text-sm">Hijab Style Tutorial #{index + 1}</h4>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {url.includes("shorts") ? "Short" : "Tutorial"}
                        </Badge>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-400 hover:text-rose-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center">
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={navigateToAnalysis}>
              Try Another Analysis
            </Button>
            <Button
              size="lg"
              className="bg-rose-400 hover:bg-rose-500 text-white w-full sm:w-auto"
              onClick={handleSaveAnalysis}
              disabled={isSaved}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaved ? "Analysis Saved" : "Save Complete Analysis"}
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={shareResults}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
      <Footer />

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={closeVideoModal}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0">
          <DialogHeader className="p-3 sm:p-4 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base sm:text-lg font-semibold">
                Hijab Tutorial Video
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeVideoModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-3 sm:p-4">
            {selectedVideo && (
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              </div>
            )}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">              <p className="text-xs sm:text-sm text-gray-600">
                Perfect for your {faceShapeData.result.predicted_face_shape} face shape
              </p>
              <a
                href={selectedVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-500 transition-colors text-xs sm:text-sm"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                Open in YouTube
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
