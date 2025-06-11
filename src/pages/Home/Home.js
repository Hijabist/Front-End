import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  Discover Your Perfect Hijab Colors
                </h1>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl">
                  Our color analysis tool helps you find the most flattering hijab colors based on your skin tone and undertone.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/analysis">
                    <Button size="lg" className="bg-rose-400 hover:bg-rose-500 text-white">
                      Start Color Analysis
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" onClick={() => scrollToSection("how-it-works")}>Learn More</Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img
                  src="landing-page.jpg"
                  alt="Colorful hijabs"
                  className="rounded-lg object-cover max-w-full w-80 h-80 sm:w-96 sm:h-96"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-400 mb-2">Features</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Why Choose Our Color Analysis</h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Our advanced color analysis tool provides personalized recommendations for your unique features.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[{
                Icon: Camera,
                title: "Personalized Analysis",
                desc: "Upload your photo or select your skin tone for a customized color palette.",
                content: "Our algorithm analyzes your unique features to determine your seasonal color type and provide accurate recommendations."
              }, {
                Icon: Palette,
                title: "Extensive Color Library",
                desc: "Access a wide range of hijab colors categorized by season and undertone.",
                content: "Browse through our curated collection of hijab colors that complement your natural features."
              }, {
                Icon: Heart,
                title: "Styling Tips",
                desc: "Get expert advice on how to style your hijab based on your color analysis.",
                content: "Learn how to create stunning looks with your recommended colors and enhance your natural beauty."
              }].map(({ Icon, title, desc, content }) => (
                <Card key={title}>
                  <CardHeader>
                    <Icon className="h-10 w-10 text-rose-400 mb-4" />
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-500 mb-2">Process</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">How It Works</h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Our simple 3-step process helps you discover your perfect hijab colors.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-center">
              {["Analyze Your Skin Tone", "Discover Your Season", "Get Recommendations"].map((title, i) => (
                <div className="flex flex-col items-center" key={i}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-gray-500 mt-2">
                    {[
                      "Upload a photo or select your skin tone from our palette to begin the analysis.",
                      "Our algorithm determines if you're a Spring, Summer, Autumn, or Winter color type.",
                      "Receive personalized hijab color recommendations that enhance your natural beauty."
                    ][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-500 mb-2">Testimonials</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">What Our Users Say</h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Hear from women who have transformed their hijab style with our color analysis.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Fatima A.",
                  type: "Spring Color Type",
                  img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
                  feedback: "I've always struggled to find hijab colors that complement my skin tone. This tool has been a game-changer!"
                },
                {
                  name: "Aisha M.",
                  type: "Winter Color Type",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                  feedback: "The color analysis was spot on! I never realized how much the right hijab colors could brighten my complexion."
                },
                {
                  name: "Noor H.",
                  type: "Autumn Color Type",
                  img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                  feedback: "I've wasted so much money on hijabs that didn't suit me. This tool has saved me time and money."
                },
              ].map(({ name, type, img, feedback }) => (
                <Card key={name}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={img} alt="User avatar" className="rounded-full w-10 h-10" />
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-gray-500">{type}</p>
                      </div>
                    </div>
                    <p className="text-gray-500">"{feedback}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-rose-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Ready to Find Your Perfect Hijab Colors?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mt-4 mb-8">
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