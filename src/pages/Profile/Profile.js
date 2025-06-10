import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
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
} from "../../components/ui/alert-dialog"
import { Palette, Settings, LogOut, Trash2, Play, ExternalLink, Calendar, Clock } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useProfilePresenter } from "./ProfilePresenter"

export default function Profile() {  const {
    user,
    savedAnalyses,
    isLoading,
    currentPassword,
    newPassword,
    confirmPassword,
    updateCurrentPassword,
    updateNewPassword,
    updateConfirmPassword,
    handleChangePassword,
    handleLogout,
    handleDeleteAnalysis,
    handleViewAnalysis,
    formatDate,
    formatTime,
    getShapeInitial,
    getToneInitial
  } = useProfilePresenter()

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
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl font-bold bg-rose-100 text-rose-600">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>          <Tabs defaultValue="analyses" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyses">Saved Analyses</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>            <TabsContent value="analyses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Saved Analyses
                  </CardTitle>
                  <CardDescription>
                    Your saved face shape and skin tone analysis results ({savedAnalyses.length} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedAnalyses.length === 0 ? (
                    <div className="text-center py-12">
                      <Palette className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No saved analyses</h3>
                      <p className="text-gray-600 mb-6">
                        You haven't saved any analysis results yet. Start by taking an analysis!
                      </p>
                      <Link to="/analysis">
                        <Button className="bg-rose-400 hover:bg-rose-500">Start Analysis</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {savedAnalyses.map((analysis) => (
                        <div
                          key={analysis.id}
                          className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold">
                                  {getShapeInitial(analysis.faceShape)}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                  {getToneInitial(analysis.skinTone)}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {analysis.faceShape} • {analysis.skinTone}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(analysis.date)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatTime(analysis.date)}
                                  </div>
                                </div>                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewAnalysis(analysis.id)}
                                className="text-rose-600 border-rose-600 hover:bg-rose-50"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this analysis? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteAnalysis(analysis.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>                              </AlertDialog>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Face Shape</h4>
                              <div className="flex items-center gap-2">
                                <span className="capitalize">{analysis.faceShape}</span>
                                <Badge variant="secondary">
                                  {analysis.confidence}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Skin Tone</h4>
                              <span className="capitalize">{analysis.skinTone}</span>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Color Groups</h4>
                              <span>{analysis.colorGroups?.length || 0} recommended groups</span>
                            </div>
                          </div>

                          {analysis.recommendations && analysis.recommendations.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Tutorial Videos</h4>
                              <div className="flex flex-wrap gap-2">
                                {analysis.recommendations.slice(0, 3).map((url, index) => (
                                  <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-rose-400 hover:text-rose-500 transition-colors"
                                  >
                                    <Play className="h-3 w-3" />
                                    Video {index + 1}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ))}
                                {analysis.recommendations.length > 3 && (
                                  <span className="text-sm text-gray-500">
                                    +{analysis.recommendations.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your account password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => updateCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => updateNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"                        type="password"
                        value={confirmPassword}
                        onChange={(e) => updateConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="bg-rose-400 hover:bg-rose-500">
                      Change Password
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Separator />

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
                      <Button variant="destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to logout? You will need to login again to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}
