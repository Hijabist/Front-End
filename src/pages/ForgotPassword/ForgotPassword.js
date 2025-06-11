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
import { ArrowLeft, Mail, CheckCircle, RefreshCw } from "lucide-react";
import { useForgotPasswordPresenter } from "./ForgotPasswordPresenter";

export default function ForgotPassword() {
  const {
    email,
    isLoading,
    isEmailSent,
    setEmail,
    sendResetEmail,
    handleBackToLogin,
    handleResendEmail,
  } = useForgotPasswordPresenter();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendResetEmail();
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Email Sent!</CardTitle>
            <CardDescription>
              We've sent password reset instructions to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Check your email
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    We sent a password reset link to{" "}
                    <span className="font-medium">{email}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={handleResendEmail}
                className="text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1 mt-1"
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3" />
                Resend email
              </button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handleBackToLogin}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">Password Reset Instructions</p>
                  <p className="mt-1">
                    We'll send you an email with a secure link to reset your
                    password. The link will expire in 1 hour.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-600 hover:bg-rose-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reset Email
                </>
              )}
            </Button>
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}