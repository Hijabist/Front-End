import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Header from "../../components/Header";
import { useLoginPresenter } from "./LoginPresenter";

export default function Login() {
  const {
    email,
    password,
    isLoading,
    rememberMe,
    updateEmail,
    updatePassword,
    updateRememberMe,
    handleLogin,
    isFormValid,
    isUserLoggedIn,
    getCurrentUserSession,
  } = useLoginPresenter();

  // Check if user is already logged in and redirect
  React.useEffect(() => {
    if (isUserLoggedIn) {
      const session = getCurrentUserSession();
      if (session) {
        // Use navigate instead of window.location.href for better SPA experience
        window.location.href = "/profile";
      }
    }
  }, [isUserLoggedIn, getCurrentUserSession]);

  return (
    <div>
      <Header />
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>

          <Card>
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                  Sign in to access your saved color analysis results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>{" "}
                    <Link
                      to="/forgot-password"
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => updatePassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={updateRememberMe}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                {" "}
                <Button
                  type="submit"
                  className="w-full bg-rose-400 hover:bg-rose-500"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Signing in and setting up your profile...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>{" "}
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-rose-400 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
