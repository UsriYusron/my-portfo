"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {AccessDeniedIllustration} from "@/components/access-denied-illustration"

export default function AccessDeniedPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Lock Icon */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <AccessDeniedIllustration /> 
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card
          className={`p-8 border-border/50 backdrop-blur-sm transition-all duration-1000 delay-300 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground text-balance">Oops! You Don't Have Access</h1>
              <p className="text-lg text-muted-foreground text-pretty">It seems you've stumbled upon a locked door.</p>
            </div>

            {/* Supportive Text */}
            <div className="space-y-4">
              <p className="text-muted-foreground text-pretty">
              I'm sorry you can't access the registration feature. If you believe this is an error, please contact me ASAP.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 text-primary-foreground transition-all duration-200 hover:scale-105"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer Links */}
        <div
          className={`flex justify-center space-x-6 text-sm transition-all duration-1000 delay-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button          
            onClick={() => router.push("#")}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
          >
            Contact Support
          </button>
          <span className="text-border">•</span>
          <button
            onClick={() => router.push("#")}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
          >
            Help Center
          </button>
        </div>
      </div>
    </div>
  )
}
