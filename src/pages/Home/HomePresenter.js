import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export class HomePresenter {
  constructor() {
    this.navigate = null
    this.isLoggedIn = false
    this.user = null
    this.setIsLoggedIn = null
    this.setUser = null
  }

  init(navigate, setIsLoggedIn, setUser) {
    this.navigate = navigate
    this.setIsLoggedIn = setIsLoggedIn
    this.setUser = setUser
    this.checkAuthStatus()
  }

  checkAuthStatus() {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"))
      if (currentUser) {
        this.isLoggedIn = true
        this.user = currentUser
        this.setIsLoggedIn(true)
        this.setUser(currentUser)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    }
  }

  navigateToAnalysis() {
    if (this.navigate) {
      this.navigate("/analysis")
    }
  }

  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }
}

export const useHomePresenter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [presenter] = useState(() => new HomePresenter())

  useEffect(() => {
    presenter.init(navigate, setIsLoggedIn, setUser)
  }, [presenter, navigate])

  return {
    isLoggedIn,
    user,
    navigateToAnalysis: () => presenter.navigateToAnalysis(),
    scrollToSection: (sectionId) => presenter.scrollToSection(sectionId)
  }
}
