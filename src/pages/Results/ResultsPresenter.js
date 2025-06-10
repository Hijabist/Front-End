import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export class ResultsPresenter {
  constructor() {
    this.navigate = null
    this.analysisData = null
    this.setAnalysisData = null
  }

  init(navigate, setAnalysisData) {
    this.navigate = navigate
    this.setAnalysisData = setAnalysisData
    this.loadAnalysisData()
  }

  loadAnalysisData() {
    try {
      const data = JSON.parse(localStorage.getItem("analysisData"))
      if (data) {
        this.analysisData = data
        this.setAnalysisData(data)
      } else {
        // If no analysis data, redirect to analysis page
        this.navigate("/analysis")
      }
    } catch (error) {
      console.error("Error loading analysis data:", error)
      this.navigate("/analysis")
    }
  }

  goToCombinedResults() {
    this.navigate("/combined-results")
  }

  retakeAnalysis() {
    this.navigate("/analysis")
  }

  getSkinToneDisplay() {
    const toneMap = {
      "dark": "Dark",
      "mid-dark": "Mid Dark", 
      "mid-light": "Mid Light",
      "light": "Light",
      "photo-analyzed": "Photo Analyzed"
    }
    return toneMap[this.analysisData?.skinTone] || "Unknown"
  }

  getFaceShapeDisplay() {
    const shapeMap = {
      "oval": "Oval",
      "round": "Round",
      "square": "Square", 
      "heart": "Heart",
      "oblong": "Oblong",
      "photo-analyzed": "Photo Analyzed"
    }
    return shapeMap[this.analysisData?.faceShape] || "Unknown"
  }
}

export const useResultsPresenter = () => {
  const [analysisData, setAnalysisData] = useState(null)
  const navigate = useNavigate()
  const [presenter] = useState(() => new ResultsPresenter())

  useEffect(() => {
    presenter.init(navigate, setAnalysisData)
  }, [presenter, navigate])

  return {
    analysisData,
    goToCombinedResults: () => presenter.goToCombinedResults(),
    retakeAnalysis: () => presenter.retakeAnalysis(),
    getSkinToneDisplay: () => presenter.getSkinToneDisplay(),
    getFaceShapeDisplay: () => presenter.getFaceShapeDisplay()
  }
}
