"use client";
import React, { useEffect, useState } from "react";
import {
  Palette,
  Users,
  Zap,
  Shield,
  ArrowRight,
  PenTool,
  Share2,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import Navbar from "../components/navbar";
import Dashboard from "./dashboard/page";

function App() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [userSignIn, setUserSignIn] = useState<boolean>(false);

  useEffect(()=>{
    if(isSignedIn){
      setUserSignIn(true);
    }else{
      setUserSignIn(false);
    }
  },[isSignedIn])

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar isSignedIn={isSignedIn} />
      <SignedOut>
        <section className="relative overflow-hidden bg-black">
          <div className="max-w-7xl mx-auto px-6 py-24 lg:py-40 text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Sketch Anything. Anywhere. Together.
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Reimagining collaboration — real-time drawing for teams, educators & creatives.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {userSignIn ? (
                <button
                  onClick={handleRedirect}
                  className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
                >
                  <span>Start Drawing</span>
                  <ArrowRight className="ml-2 inline-block" />
                </button>
              ) : (
                <SignInButton forceRedirectUrl="/dashboard">
                  <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                    <span>Start Drawing</span>
                    <ArrowRight className="ml-2 inline-block" />
                  </button>
                </SignInButton>
              )}
              <button className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Subtle Blobs */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 blur-2xl rounded-full animate-pulse delay-1000"></div>
        </section>

        <section className="py-24 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Built to Power Visual Collaboration
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Feature-rich, blazing fast, and beautifully dark.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { icon: <Users className="text-white" />, title: "Real-time Collaboration", desc: "Draw with your team live — no lag, just clarity." },
                { icon: <Palette className="text-white" />, title: "Pro Drawing Tools", desc: "Smooth pens, sharp shapes, and pixel-perfect design." },
                { icon: <Zap className="text-white" />, title: "Lightning Fast", desc: "Optimized for performance. Everything just flows." },
                { icon: <Shield className="text-white" />, title: "Secure by Default", desc: "Encryption built-in. Share with confidence." },
                { icon: <Share2 className="text-white" />, title: "Instant Sharing", desc: "One click. One link. Collaborate in seconds." },
                { icon: <Download className="text-white" />, title: "Flexible Exports", desc: "Export as PNG, SVG or PDF — perfect for anything." }
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                >
                  <div className="mb-4">{icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-black border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Create in the Dark?
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Join thousands of designers, educators, and founders using DrawWithMe to bring ideas to life in full darkness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all">
                Get Started Free
              </button>
              <SignInButton>
                <button className="border border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-black transition-all">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </section>

        <footer className="bg-[#0a0a0a] border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">DrawWithMe</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
          <div className="text-center text-gray-600 text-sm py-4 border-t border-gray-800">
            &copy; 2025 DrawWithMe. All rights reserved.
          </div>
        </footer>
      </SignedOut>
    </div>
  );
}

export default App;