'use client'
import { SignedIn, SignInButton, UserButton, SignedOut, useClerk } from "@clerk/nextjs";
import { PenTool, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar({ isSignedIn }: any) {
    const router = useRouter();
    const {signOut} = useClerk();
    const openCreateCanvasForm = ()=>{
        router.push('create-canvas');
    }
  return (
    <div>
  <header className="bg-[#0b0b0b] shadow-sm border-b border-gray-800 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-5">
        <div className="flex justify-between items-center w-full">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-[0_0_10px_#00ffd080]">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              DrawWithMe
            </span>
          </div>

          {/* Sign In Button */}
          <SignedOut>
            <SignInButton forceRedirectUrl={"/dashboard"}>
              <button className="border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 text-gray-200 px-6 py-2 rounded-xl font-semibold text-base transition-all duration-300 backdrop-blur-md bg-black/20">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        <SignedIn>
          <div className="flex items-center space-x-4">
            <button
              className="border border-gray-700 hover:border-white text-gray-300 hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 bg-black/20 backdrop-blur-md hover:shadow-[0_0_10px_#00ffd060] flex items-center gap-2"
              onClick={openCreateCanvasForm}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="whitespace-nowrap">Create a canvas</span>
            </button>
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-gray-700 rounded-full" },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </div>
  </header>
</div>
  );
}
