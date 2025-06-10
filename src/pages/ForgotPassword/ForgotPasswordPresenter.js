import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../hooks/use-toast"

export class ForgotPasswordPresenter {
  constructor() {
    this.navigate = null
    this.toast = null
    this.email = ""
    this.isLoading = false
    this.emailSent = false
    this.setEmail = null
    this.setIsLoading = null
    this.setEmailSent = null
  }

  init(navigate, toast, setEmail, setIsLoading, setEmailSent) {
    this.navigate = navigate
    this.toast = toast
    this.setEmail = setEmail
    this.setIsLoading = setIsLoading
    this.setEmailSent = setEmailSent
  }

  updateEmail(email) {
    this.email = email
    this.setEmail(email)
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async handleResetPassword(e) {
    e.preventDefault()
    
    if (!this.isValidEmail(this.email)) {
      this.toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address."
      })
      return
    }

    this.setIsLoading(true)

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const userExists = users.some(user => user.email === this.email)

          if (userExists) {
            // Generate reset token (in real app, this would be done server-side)
            const resetToken = Math.random().toString(36).substring(2, 15)
            localStorage.setItem("resetToken", JSON.stringify({
              email: this.email,
              token: resetToken,
              expires: Date.now() + 3600000 // 1 hour
            }))

            this.setEmailSent(true)
            this.toast({
              title: "Reset email sent",
              description: "Check your email for password reset instructions."
            })
          } else {
            this.toast({
              variant: "destructive", 
              title: "Email not found",
              description: "No account found with this email address."
            })
          }
        } catch (error) {
          this.toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send reset email. Please try again."
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

  goToResetPassword() {
    // In a real app, this would come from the email link
    const resetData = JSON.parse(localStorage.getItem("resetToken") || "{}")
    if (resetData.token) {
      this.navigate(`/reset-password?token=${resetData.token}`)
    }
  }
}

export const useForgotPasswordPresenter = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [presenter] = useState(() => new ForgotPasswordPresenter())

  // Initialize presenter
  presenter.init(navigate, toast, setEmail, setIsLoading, setEmailSent)

  return {
    email,
    isLoading,
    emailSent,
    updateEmail: (email) => presenter.updateEmail(email),
    handleResetPassword: (e) => presenter.handleResetPassword(e),
    goToLogin: () => presenter.goToLogin(),
    goToResetPassword: () => presenter.goToResetPassword(),
    isFormValid: presenter.isValidEmail(presenter.email)
  }
}
