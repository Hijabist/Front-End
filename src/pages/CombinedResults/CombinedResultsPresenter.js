import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "../../hooks/use-toast"
import { 
  faceShapeData as initialFaceShapeData, 
  skinToneData as initialSkinToneData,
  mockUploadedImage,
  getGroupDisplayName,
  getYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail
} from "../../data"

class CombinedResultsPresenter {
  constructor(navigate, toast) {
    this.navigate = navigate
    this.toast = toast
    this.init()
  }

  init() {
    this.faceShapeData = initialFaceShapeData
    this.skinToneData = initialSkinToneData
    this.uploadedImage = null
    this.isSaved = false
    this.isLoggedIn = false
    this.selectedVideo = null
    this.showVideoModal = false
    this.sortedProbabilities = []

    this.checkAuthAndLoadData()
    this.calculateSortedProbabilities()
  }

  checkAuthAndLoadData() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    this.isLoggedIn = !!currentUser

    // Set uploaded image from mock data
    this.uploadedImage = mockUploadedImage
  }

  calculateSortedProbabilities() {
    this.sortedProbabilities = Object.entries(this.faceShapeData.result.all_probabilities).sort(
      ([, a], [, b]) => b.probability - a.probability,
    )
  }

  handleVideoClick(url) {
    this.selectedVideo = url
    this.showVideoModal = true
  }

  closeVideoModal() {
    this.showVideoModal = false
    this.selectedVideo = null
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
      })
      return
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    // Create analysis object
    const analysisData = {
      id: Date.now().toString(),
      date: Date.now(),
      faceShape: this.faceShapeData.result.predicted_face_shape,
      confidence: this.faceShapeData.result.confidence,
      skinTone: this.skinToneData.skin_tone,
      colorGroups: this.skinToneData.recommended_groups,
      recommendations: this.faceShapeData.result.hijabRecomendation.recommendations,
    }

    // Update user data in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        const savedAnalyses = u.savedAnalyses || []
        return {
          ...u,
          savedAnalyses: [...savedAnalyses, analysisData],
        }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    this.isSaved = true

    this.toast({
      title: "Analysis saved",
      description: "Your complete analysis results have been saved to your profile.",
    })
  }

  navigateToAnalysis() {
    this.navigate("/analysis")
  }

  shareResults() {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: "My Hijab Analysis Results",
        text: `Check out my personalized hijab analysis! Face shape: ${this.faceShapeData.result.predicted_face_shape}, Skin tone: ${this.skinToneData.skin_tone}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      this.toast({
        title: "Link copied",
        description: "Results link has been copied to your clipboard.",
      })
    }
  }

  getGroupDisplayName(group) {
    return getGroupDisplayName(group)
  }

  getYouTubeThumbnail(url) {
    return getYouTubeThumbnail(url)
  }

  getYouTubeEmbedUrl(url) {
    return getYouTubeEmbedUrl(url)
  }
}

export function useCombinedResultsPresenter() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  
  const [presenter] = useState(() => new CombinedResultsPresenter(navigate, toast))
  const [, forceUpdate] = useState({})

  const triggerUpdate = () => forceUpdate({})

  useEffect(() => {
    presenter.update = triggerUpdate
  }, [presenter])

  return {
    presenter,
    // Data getters
    faceShapeData: presenter.faceShapeData,
    skinToneData: presenter.skinToneData,
    uploadedImage: presenter.uploadedImage,
    isSaved: presenter.isSaved,
    isLoggedIn: presenter.isLoggedIn,
    selectedVideo: presenter.selectedVideo,
    showVideoModal: presenter.showVideoModal,
    sortedProbabilities: presenter.sortedProbabilities,
    
    // Action methods
    handleVideoClick: (url) => {
      presenter.handleVideoClick(url)
      triggerUpdate()
    },
    closeVideoModal: () => {
      presenter.closeVideoModal()
      triggerUpdate()
    },
    handleSaveAnalysis: () => {
      presenter.handleSaveAnalysis()
      triggerUpdate()
    },
    navigateToAnalysis: () => presenter.navigateToAnalysis(),
    shareResults: () => presenter.shareResults(),
    
    // Utility methods
    getGroupDisplayName: presenter.getGroupDisplayName.bind(presenter),
    getYouTubeThumbnail: presenter.getYouTubeThumbnail.bind(presenter),
    getYouTubeEmbedUrl: presenter.getYouTubeEmbedUrl.bind(presenter),
  }
}

export default CombinedResultsPresenter
