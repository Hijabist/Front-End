import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useToast } from "../../hooks/use-toast"

export class ResetPasswordPresenter {
  constructor() {
    this.navigate = null
    this.toast = null
    this.searchParams = null
    this.token = ""
    this.password = ""
    this.confirmPassword = ""
    this.isLoading = false
    this.isValidToken = false
    this.setPassword = null
    this.setConfirmPassword = null
    this.setIsLoading = null
    this.setIsValidToken = null
  }

  init(navigate, toast, searchParams, setPassword, setConfirmPassword, setIsLoading, setIsValidToken) {
    this.navigate = navigate
    this.toast = toast
    this.searchParams = searchParams
    this.setPassword = setPassword
    this.setConfirmPassword = setConfirmPassword
    this.setIsLoading = setIsLoading
    this.setIsValidToken = setIsValidToken
    this.validateToken()
  }

  validateToken() {
    try {
      this.token = this.searchParams.get("token") || ""
      const resetData = JSON.parse(localStorage.getItem("resetToken") || "{}")
      
      if (resetData.token === this.token && Date.now() < resetData.expires) {
        this.isValidToken = true
        this.setIsValidToken(true)
      } else {
        this.toast({
          variant: "destructive",
          title: "Invalid or expired token",
          description: "This reset link is invalid or has expired."
        })
        this.navigate("/forgot-password")
      }
    } catch (error) {
      this.navigate("/forgot-password")
    }
  }

  updatePassword(password) {
    this.password = password
    this.setPassword(password)
  }

  updateConfirmPassword(password) {
    this.confirmPassword = password
    this.setConfirmPassword(password)
  }

  validateForm() {
    return (
      this.password.length >= 6 &&
      this.password === this.confirmPassword &&
      this.isValidToken
    )
  }

  async handleResetPassword(e) {
    e.preventDefault()

    if (!this.validateForm()) {
      this.toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please ensure passwords match and are at least 6 characters long."
      })
      return
    }

    this.setIsLoading(true)

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const resetData = JSON.parse(localStorage.getItem("resetToken") || "{}")
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          
          const userIndex = users.findIndex(user => user.email === resetData.email)
          
          if (userIndex !== -1) {
            users[userIndex].password = this.password
            localStorage.setItem("users", JSON.stringify(users))
            localStorage.removeItem("resetToken")

            this.toast({
              title: "Password reset successful",
              description: "Your password has been reset successfully."
            })

            this.navigate("/login")
          } else {
            this.toast({
              variant: "destructive",
              title: "Error",
              description: "User not found."
            })
          }
        } catch (error) {
          this.toast({
            variant: "destructive",
            title: "Error", 
            description: "Failed to reset password. Please try again."
          })
        }

        this.setIsLoading(false)
        resolve()
      }, 1000)
    })
  }

  goToLogin() {
    this.navigate("/login")
  }
}

export const useResetPasswordPresenter = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [presenter] = useState(() => new ResetPasswordPresenter())

  useEffect(() => {
    presenter.init(navigate, toast, searchParams, setPassword, setConfirmPassword, setIsLoading, setIsValidToken)
  }, [presenter, navigate, toast, searchParams])

  return {
    password,
    confirmPassword,
    isLoading,
    isValidToken,
    updatePassword: (password) => presenter.updatePassword(password),
    updateConfirmPassword: (password) => presenter.updateConfirmPassword(password),
    handleResetPassword: (e) => presenter.handleResetPassword(e),
    goToLogin: () => presenter.goToLogin(),
    isFormValid: presenter.validateForm()
  }
}
