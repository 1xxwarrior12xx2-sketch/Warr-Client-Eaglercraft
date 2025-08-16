"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gamepad2 } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing Warr Client...")
  const [showLogo, setShowLogo] = useState(false)

  const loadingSteps = [
    "Initializing Warr Client...",
    "Loading WebGL engine...",
    "Setting up texture systems...",
    "Initializing client mods...",
    "Loading user preferences...",
    "Preparing game environment...",
    "Ready to play!",
  ]

  useEffect(() => {
    // Show logo animation
    const logoTimer = setTimeout(() => setShowLogo(true), 500)

    // Simulate loading process
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length)

        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex])
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 1000)
          return 100
        }

        return Math.min(newProgress, 100)
      })
    }, 200)

    return () => {
      clearTimeout(logoTimer)
      clearInterval(interval)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md bg-black/30 border-white/20 backdrop-blur-xl relative z-10">
        <CardContent className="p-8 text-center">
          <div className={`transition-all duration-1000 ${showLogo ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Warr Client
            </h1>
            <p className="text-gray-300 mb-8">Loading the ultimate Eaglercraft experience...</p>

            <div className="space-y-4">
              <Progress value={progress} className="w-full h-2 bg-white/10" />
              <p className="text-sm text-gray-400 min-h-[20px]">{loadingText}</p>
              <p className="text-xs text-gray-500">{Math.round(progress)}% complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
