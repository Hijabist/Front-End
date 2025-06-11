import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Code,
  Brain,
  Github,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAboutUsPresenter } from "./AboutUsPresenter";

export default function AboutUs() {
  const { teamMembers, companyInfo, features, technologies } =
    useAboutUsPresenter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-rose-50 to-white">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-rose-400 mb-6 self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>{" "}
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              About {companyInfo.name}
            </h1>
            <p className="text-gray-500 md:text-xl max-w-3xl mx-auto mb-8">
              {companyInfo.mission}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/analysis">
                <Button size="lg" className="bg-rose-400 hover:bg-rose-500">
                  Try Our Color Analysis
                </Button>
              </Link>
              <Button size="lg" variant="outline" asChild>
                <a href="#team">Meet Our Team</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">
                  Our Mission
                </h2>{" "}
                <p className="text-gray-500 mb-4">
                  {companyInfo.description.intro}
                </p>
                <p className="text-gray-500 mb-4">
                  {companyInfo.description.challenge}
                </p>
                <p className="text-gray-500">{companyInfo.description.goal}</p>
              </div>{" "}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-rose-50 rounded-lg p-6 border border-rose-100"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-500 md:text-xl max-w-3xl mx-auto">
                Our diverse team combines expertise in machine learning,
                computer vision, and web development to create a seamless and
                accurate hijab styling experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-none shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-fit transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold text-xl">
                        {member.name}
                      </h3>
                      <p className="text-white/80 text-sm">{member.role}</p>
                    </div>
                    <Badge
                      className={`absolute top-4 right-4 ${
                        member.type === "ML" ? "bg-purple-500" : "bg-rose-500"
                      }`}
                    >
                      {member.type === "ML" ? (
                        <Brain className="h-3 w-3 mr-1" />
                      ) : (
                        <Code className="h-3 w-3 mr-1" />
                      )}
                      {member.type === "ML"
                        ? "Machine Learning"
                        : "Web Development"}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex space-x-3">
                      <a
                        href={member.social.github}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a
                        href={member.social.linkedin}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">
                Our Technology
              </h2>
              <p className="text-gray-500 md:text-xl max-w-3xl mx-auto">
                We combine advanced machine learning algorithms with intuitive
                web design to create a seamless and accurate experience.
              </p>
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    Machine Learning
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    {technologies.machineLearning.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-600" />
                    Backend Development
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    {technologies.backend.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-6 rounded-lg border border-rose-200">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Code className="h-5 w-5 mr-2 text-rose-600" />
                    Frontend Development
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    {technologies.frontend.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-rose-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-green-600" />
                    Data Science
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    {technologies.dataScience.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
