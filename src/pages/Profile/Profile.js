import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useProfilePresenter } from "./ProfilePresenter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  Clock,
  LogOut,
  Play,
  ExternalLink,
  Calendar,
  Palette,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Profile() {
  const {
    user,
    lastAnalysis,
    isLoading,
    handleLogout,
    handleViewAnalysis,
    formatDate,
    formatTime,
    getShapeInitial,
    getToneInitial,
    formatSkinTone,
  } = useProfilePresenter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage />
              <AvatarFallback className="text-2xl font-bold bg-rose-100 text-rose-600">
                {user.displayName?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold break-words">
                {user.displayName || user.email}
              </h1>
              <p className="text-sm text-gray-600 break-words">{user.email}</p>
            </div>
          </div>

          {/* Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Last Analysis
              </CardTitle>
              <CardDescription>
                Your most recent analysis result
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!lastAnalysis ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No recent analysis
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't performed any analysis yet. Start by taking an
                    analysis!
                  </p>
                  <Link to="/analysis">
                    <Button className="bg-rose-400 hover:bg-rose-500">
                      Start Analysis
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="border rounded-lg p-6">
                  {/* Info Section */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex gap-2 justify-center sm:justify-start">
                        <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-lg">
                          {getShapeInitial(lastAnalysis.faceShape)}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                          {getToneInitial(lastAnalysis.skinTone)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg sm:text-xl">
                          {lastAnalysis.faceShape} •{" "}
                          {formatSkinTone(lastAnalysis.skinTone)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(lastAnalysis.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(lastAnalysis.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleViewAnalysis(lastAnalysis.id)}
                      className="text-rose-600 border-rose-600 hover:bg-rose-50 w-full md:w-auto"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </div>

                  {/* Grid Detail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <div className="text-center p-4 bg-rose-50 rounded-lg">
                      <h4 className="font-medium mb-2">Face Shape</h4>
                      <div className="flex items-center justify-center gap-2">
                        <span className="capitalize text-lg">
                          {lastAnalysis.faceShape}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-rose-100 text-rose-700"
                        >
                          {lastAnalysis.confidence}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-medium mb-2">Skin Tone</h4>
                      <span className="text-lg">
                        {formatSkinTone(lastAnalysis.skinTone)}
                      </span>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-2">Color Groups</h4>
                      <span className="text-lg">
                        {lastAnalysis.colorGroups?.length || 0} groups
                      </span>
                    </div>
                  </div>

                  {/* Color Groups Preview */}
                  {lastAnalysis.recommendedGroups?.length > 0 && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Recommended Color Palettes (
                        {lastAnalysis.recommendedGroups.length} groups)
                      </h4>
                      <div className="space-y-3">
                        {lastAnalysis.recommendedGroups
                          .slice(0, 4)
                          .map((group, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg border p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium capitalize">
                                  {group.group.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {group.colors.length} colors
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {group.colors.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
                                    className="w-6 h-6 rounded-md border border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                                    style={{ backgroundColor: color }}
                                    title={`${color} - ${group.group.replace(
                                      /_/g,
                                      " "
                                    )}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        {lastAnalysis.recommendedGroups.length > 4 && (
                          <div className="text-center pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewAnalysis(lastAnalysis.id)
                              }
                              className="text-purple-600 border-purple-600 hover:bg-purple-50"
                            >
                              View All {lastAnalysis.recommendedGroups.length}{" "}
                              Color Groups
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommended Tutorials */}
                  {lastAnalysis.recommendations?.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Recommended Tutorial Videos (
                        {lastAnalysis.recommendations.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {lastAnalysis.recommendations
                          .slice(0, 6)
                          .map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
                            >
                              <Play className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium">
                                Tutorial {index + 1}
                              </span>
                              <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                            </a>
                          ))}
                      </div>
                      {lastAnalysis.recommendations.length > 6 && (
                        <div className="text-center mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAnalysis(lastAnalysis.id)}
                            className="text-rose-600 border-rose-600 hover:bg-rose-50"
                          >
                            View All {lastAnalysis.recommendations.length}{" "}
                            Videos
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logout Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <LogOut className="h-5 w-5" />
                Account Actions
              </CardTitle>
              <CardDescription>Manage your account session.</CardDescription>
            </CardHeader>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout? You will need to login
                      again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
