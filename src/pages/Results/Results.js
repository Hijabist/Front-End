import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { ArrowLeft, Palette, User } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useResultsPresenter } from "./ResultsPresenter"

export default function Results() {
  const {
    analysisData,
    goToCombinedResults,
    retakeAnalysis,
    getSkinToneDisplay,
    getFaceShapeDisplay
  } = useResultsPresenter()

  if (!analysisData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Analysis Data Found</h2>
            <p className="text-muted-foreground mb-6">Please complete an analysis first.</p>
            <Link to="/analysis">
              <Button className="bg-rose-400 hover:bg-rose-500">
                Start Analysis
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/analysis"
          className="inline-flex items-center gap-2 text-rose-400 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
          <p className="text-muted-foreground">
            Here are your personalized color and style recommendations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-rose-400" />
                Skin Tone Analysis
              </CardTitle>
              <CardDescription>
                Your skin tone determines which colors complement you best
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detected Skin Tone</p>
                  <Badge variant="secondary" className="mt-1">
                    {getSkinToneDisplay()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your skin tone, we've identified the most flattering hijab colors that will enhance your natural beauty.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-rose-400" />
                Face Shape Analysis
              </CardTitle>
              <CardDescription>
                Your face shape helps determine the best hijab styles for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detected Face Shape</p>
                  <Badge variant="secondary" className="mt-1">
                    {getFaceShapeDisplay()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  We've identified styling techniques and hijab arrangements that will complement your face shape perfectly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={goToCombinedResults}
            size="lg"
            className="bg-rose-400 hover:bg-rose-500"
          >
            View Detailed Results
          </Button>
          <Button
            onClick={retakeAnalysis}
            variant="outline"
            size="lg"
          >
            Retake Analysis
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
