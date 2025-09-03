"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function MaintenancePage() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNotifyMe = () => {
    if (email) {
      setIsSubscribed(true)
      // In a real app, you'd send this to your backend
      console.log("Email submitted:", email)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Animated Header */}
        <div className="space-y-4">
          <div className="animate-bounce-gentle">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">I'll Be Back Soon!</h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-lg mx-auto">
          My site is currently under maintenance. Thank you for your patience while I make improvements!
          </p>
        </div>

        {/* Animated Maintenance Illustration */}
        <div className="flex justify-center items-center space-x-4 py-8">
          <div className="relative">
            {/* Construction Worker Icon */}
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <svg className="w-12 h-12 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 9.55 14.55 10 14 10V22H16V16H20V22H22V10C22 9.45 21.55 9 21 9ZM10 22H12V16H8V22H10ZM6 12.5C6 12.22 6.22 12 6.5 12H9.5C9.78 12 10 12.22 10 12.5V14H6V12.5Z" />
              </svg>
            </div>

            {/* Rotating Gear */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-rotate-gear">
              <svg className="w-5 h-5 text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="p-6 bg-card">
          <div className="space-y-4">
            <p className="text-sm font-medium text-card-foreground">Maintenance Progress</p>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div className="h-full bg-accent rounded-full animate-progress-fill"></div>
            </div>
            <p className="text-xs text-muted-foreground">Estimated completion: 75%</p>
          </div>
        </Card>

        {/* Email Notification */}
        {!isSubscribed ? (
          <Card className="p-6 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Get Notified Form Yusron</h3>
              <p className="text-sm text-muted-foreground">Enter your email to be notified when we're back online</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleNotifyMe} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Notify Me
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-accent/10 border-accent">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                </svg>
                <h3 className="text-lg font-semibold text-accent-foreground">You're all set!</h3>
              </div>
              <p className="text-sm text-muted-foreground">We'll email you as soon as we're back online.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
