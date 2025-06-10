// Authentication utility functions
export const AuthUtils = {
  // Get current user session
  getCurrentUser: () => {
    const currentUser = localStorage.getItem("currentUser")
    return currentUser ? JSON.parse(currentUser) : null
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return localStorage.getItem("isLoggedIn") === "true" && localStorage.getItem("currentUser")
  },

  // Get user display name
  getUserDisplayName: () => {
    const user = AuthUtils.getCurrentUser()
    return user ? user.name : "Guest"
  },

  // Get username
  getUsername: () => {
    const user = AuthUtils.getCurrentUser()
    return user ? user.username : null
  },

  // Get user email
  getUserEmail: () => {
    const user = AuthUtils.getCurrentUser()
    return user ? user.email : null
  },

  // Get user UI state
  getUserUIState: () => {
    const uiState = localStorage.getItem("userUIState")
    return uiState ? JSON.parse(uiState) : {
      lastPage: '/',
      sidebarExpanded: true,
      recentAnalyses: []
    }
  },

  // Update user UI state
  updateUserUIState: (newUIState) => {
    const currentUser = AuthUtils.getCurrentUser()
    if (currentUser) {
      const currentUIState = AuthUtils.getUserUIState()
      const updatedUIState = { ...currentUIState, ...newUIState }
      
      // Update in current user object
      currentUser.ui = updatedUIState
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      localStorage.setItem("userUIState", JSON.stringify(updatedUIState))
    }
  },


  // Get user's analysis history
  getUserAnalyses: () => {
    const user = AuthUtils.getCurrentUser()
    if (!user) return []
    
    const analyses = localStorage.getItem(`analyses_${user.email}`)
    return analyses ? JSON.parse(analyses) : []
  },

  // Save analysis for user
  saveUserAnalysis: (analysisData) => {
    const user = AuthUtils.getCurrentUser()
    if (!user) return false
    
    const analyses = AuthUtils.getUserAnalyses()
    const newAnalysis = {
      ...analysisData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user.id
    }
    
    analyses.unshift(newAnalysis) // Add to beginning
    localStorage.setItem(`analyses_${user.email}`, JSON.stringify(analyses))
    
    // Update recent analyses in UI state
    AuthUtils.updateUserUIState({
      recentAnalyses: analyses.slice(0, 3)
    })
    
    return true
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    localStorage.removeItem("userUsername")
    localStorage.removeItem("userUIState")
    localStorage.removeItem("lastLoginTime")
  },

  // Check if current user has completed profile setup
  hasCompletedProfile: () => {
    const user = AuthUtils.getCurrentUser()
    if (!user) return false
    
    // Check if user has done at least one analysis
    const analyses = AuthUtils.getUserAnalyses()
    return analyses.length > 0
  },

  // Get user session duration
  getSessionDuration: () => {
    const user = AuthUtils.getCurrentUser()
    if (!user || !user.loginTime) return 0
    
    const loginTime = new Date(user.loginTime)
    const currentTime = new Date()
    return Math.floor((currentTime - loginTime) / (1000 * 60)) // in minutes
  }
}

export default AuthUtils
