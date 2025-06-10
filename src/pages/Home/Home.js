import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ChevronRight, Camera, Palette, Heart } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useHomePresenter } from "./HomePresenter"

export default function Home() {
  const { isLoggedIn, user, navigateToAnalysis, scrollToSection } = useHomePresenter()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-rose-50 to-white">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Discover Your Perfect Hijab Colors
                </h1>
                <p className="text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Our color analysis tool helps you find the most flattering hijab colors based on your skin tone and
                  undertone. Look your best with personalized recommendations.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/analysis">
                    <Button size="lg" className="bg-rose-400 hover:bg-rose-500 text-white">
                      Start Color Analysis
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => scrollToSection("how-it-works")}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop&crop=face"
                  alt="Colorful hijabs"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-400">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Our Color Analysis</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Our advanced color analysis tool provides personalized recommendations for your unique features.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Camera className="h-10 w-10 text-rose-400 mb-4" />
                  <CardTitle>Personalized Analysis</CardTitle>
                  <CardDescription>
                    Upload your photo or select your skin tone for a customized color palette.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Our algorithm analyzes your unique features to determine your seasonal color type and provide
                    accurate recommendations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Palette className="h-10 w-10 text-rose-400 mb-4" />
                  <CardTitle>Extensive Color Library</CardTitle>
                  <CardDescription>
                    Access a wide range of hijab colors categorized by season and undertone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Browse through our curated collection of hijab colors that complement your natural features.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Heart className="h-10 w-10 text-rose-400 mb-4" />
                  <CardTitle>Styling Tips</CardTitle>
                  <CardDescription>
                    Get expert advice on how to style your hijab based on your color analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Learn how to create stunning looks with your recommended colors and enhance your natural beauty.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-500">Process</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Our simple 3-step process helps you discover your perfect hijab colors.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold">Analyze Your Skin Tone</h3>
                <p className="text-gray-500 mt-2">
                  Upload a photo or select your skin tone from our palette to begin the analysis.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold">Discover Your Season</h3>
                <p className="text-gray-500 mt-2">
                  Our algorithm determines if you're a Spring, Summer, Autumn, or Winter color type.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold">Get Recommendations</h3>
                <p className="text-gray-500 mt-2">
                  Receive personalized hijab color recommendations that enhance your natural beauty.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-500">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Hear from women who have transformed their hijab style with our color analysis.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">Fatima A.</p>
                      <p className="text-sm text-gray-500">Spring Color Type</p>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    "I've always struggled to find hijab colors that complement my skin tone. This tool has been a
                    game-changer! Now I receive compliments every time I wear my recommended colors."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">Aisha M.</p>
                      <p className="text-sm text-gray-500">Winter Color Type</p>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    "The color analysis was spot on! I never realized how much the right hijab colors could brighten my
                    complexion and make me look more vibrant."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">Noor H.</p>
                      <p className="text-sm text-gray-500">Autumn Color Type</p>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    "I've wasted so much money on hijabs that didn't suit me. This tool has saved me time and money by
                    helping me choose colors that truly enhance my features."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-rose-50">
          <div className="container px-4 md:px-6 text-center mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Find Your Perfect Hijab Colors?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl lg:text-base xl:text-xl mt-4 mb-8">
              Start your color analysis journey today and transform your hijab style.
            </p>
            <Link to="/analysis">
              <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white">
                Start Free Analysis
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
