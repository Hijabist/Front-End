import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { User, Mail, Lock, ArrowRight } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useRegisterPresenter } from "./RegisterPresenter"

export default function Register() {
  const {
    name,
    email,
    password,
    isLoading,
    updateName,
    updateEmail,
    updatePassword,
    handleRegister,
    isFormValid,
    passwordStrength
  } = useRegisterPresenter()

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "text-red-500"
      case "medium": return "text-yellow-500"
      case "strong": return "text-green-500"
      default: return "text-muted-foreground"
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak": return "Weak password"
      case "medium": return "Medium strength"
      case "strong": return "Strong password"
      default: return "Password must be at least 6 characters long"
    }
  }

  // Local validation for button state
  const isButtonDisabled = isLoading || 
    !name.trim() || 
    name.trim().length < 2 || 
    !email.trim() || 
    !email.includes('@') || 
    password.length < 6;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container flex flex-col items-center justify-center py-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Sign up to save your color analysis results</p>
          </div>

          <Card>
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="text-xl">Register</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="pl-10"
                      value={name}
                      onChange={(e) => updateName(e.target.value)}
                      required
                    />
                  </div>
                  {name && name.trim().length > 0 && name.trim().length < 2 && (
                    <p className="text-xs text-red-500">Name must be at least 2 characters</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => updateEmail(e.target.value)}
                      required
                    />
                  </div>
                  {email && !email.includes('@') && (
                    <p className="text-xs text-red-500">Please enter a valid email address</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => updatePassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  {password && (
                    <p className={`text-xs ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit" 
                  className="w-full bg-rose-400 hover:bg-rose-500" 
                  disabled={isButtonDisabled}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-rose-400 hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}