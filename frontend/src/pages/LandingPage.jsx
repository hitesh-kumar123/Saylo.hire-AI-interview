import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [animateItems, setAnimateItems] = useState([false, false, false]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Animate features when they come into view
      const featureSection = document.getElementById("features");
      if (featureSection) {
        const rect = featureSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setAnimateItems([true, true, true]);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Trigger initial animations
    setTimeout(() => {
      setAnimateItems([true, false, false]);
      setTimeout(() => setAnimateItems([true, true, false]), 200);
      setTimeout(() => setAnimateItems([true, true, true]), 400);
    }, 500);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="bg-gradient-animated absolute w-full h-full opacity-10 z-0"></div>

      <header
        className={`fixed w-full transition-all duration-300 z-50 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <h1 className="relative text-3xl font-bold text-gradient">
                Saylo.hire
              </h1>
            </div>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            <div
              className="flex flex-col w-full md:w-1/2 justify-center items-start animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
                <span className="text-gradient">Ace Your Next</span>
                <br />
                <span className="relative">
                  Interview
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></span>
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-md">
                Saylo.hire uses advanced AI to help you practice and perfect
                your interview skills with personalized feedback.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-md shadow-blue hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 glass-effect text-blue-600 font-medium rounded-md hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div
              className="w-full md:w-1/2 py-6 flex justify-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden animate-float">
                  <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded-md"></div>
                      <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
                      <div className="h-10 bg-blue-100 rounded-md w-1/2 mt-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="hidden md:block absolute top-1/4 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
          <div
            className="hidden md:block absolute bottom-1/4 left-0 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 text-gradient">
              How Saylo.hire Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div
                className={`bg-white p-8 rounded-xl shadow-blue hover-scale ${
                  animateItems[0] ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ transitionDelay: "0.1s" }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Practice with AI
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI interviewer generates tailored questions based on your
                  resume and job description, simulating real interview
                  scenarios.
                </p>
              </div>

              <div
                className={`bg-white p-8 rounded-xl shadow-blue hover-scale ${
                  animateItems[1] ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ transitionDelay: "0.2s" }}
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Get Detailed Feedback
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive comprehensive feedback on your answers, communication
                  skills, and areas for improvement after each practice session.
                </p>
              </div>

              <div
                className={`bg-white p-8 rounded-xl shadow-blue hover-scale ${
                  animateItems[2] ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ transitionDelay: "0.3s" }}
              >
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  <span className="text-4xl">📈</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Track Your Progress
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your improvement over time with detailed analytics and
                  performance tracking for each interview topic.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-16 text-gradient">
                What Our Users Say
              </h2>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white rounded-2xl p-10 shadow-blue">
                  <svg
                    className="w-12 h-12 text-blue-200 absolute top-6 left-6"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-xl italic text-gray-600 mb-8">
                    "Saylo.hire transformed my interview preparation. The AI
                    feedback helped me identify weaknesses in my responses that
                    I never noticed before. I landed my dream job after just two
                    weeks of practice!"
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                      JS
                    </div>
                    <div className="ml-4 text-left">
                      <p className="font-semibold">Jessica S.</p>
                      <p className="text-gray-500 text-sm">Software Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-animated">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to ace your next interview?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Join thousands of job seekers who have improved their interview
                skills with Saylo.hire.
              </p>
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-blue-600 font-medium rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started For Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-gradient mb-4">
                Saylo.hire
              </h3>
              <p className="text-gray-400 max-w-xs">
                The AI-powered interview preparation platform that helps you
                land your dream job.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Saylo.hire. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
