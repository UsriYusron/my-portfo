"use client"

import { useEffect, useState } from "react"

export function AccessDeniedIllustration() {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Background Circle */}
      <div
        className={`absolute inset-0 bg-primary/5 rounded-full transition-all duration-1000 ${
          isAnimated ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />

      {/* Animated Robot/Lock Character */}
      <div className="relative flex items-center justify-center w-full h-full">
        <svg
          className={`w-24 h-24 text-primary transition-all duration-700 ${isAnimated ? "animate-bounce" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Robot Body */}
          <rect x="25" y="40" width="50" height="45" rx="8" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />

          {/* Robot Head */}
          <rect x="30" y="15" width="40" height="35" rx="6" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />

          {/* Eyes */}
          <circle cx="40" cy="28" r="3" fill="currentColor" />
          <circle cx="60" cy="28" r="3" fill="currentColor" />

          {/* Lock Symbol on Body */}
          <rect x="40" y="50" width="20" height="15" rx="2" strokeWidth="2" />
          <circle cx="50" cy="57" r="2" fill="currentColor" />
          <path d="M45 50V45a5 5 0 0 1 10 0v5" strokeWidth="2" />

          {/* Arms */}
          <line x1="25" y1="55" x2="15" y2="50" strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="55" x2="85" y2="50" strokeWidth="3" strokeLinecap="round" />

          {/* Key in Hand */}
          <g className={`transition-all duration-500 delay-700 ${isAnimated ? "opacity-100" : "opacity-0"}`}>
            <rect x="85" y="48" width="8" height="4" rx="2" strokeWidth="1.5" />
            <line x1="93" y1="50" x2="96" y2="50" strokeWidth="1.5" />
            <line x1="95" y1="48" x2="95" y2="52" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-primary/30 rounded-full transition-all duration-1000 delay-${i * 200} ${
              isAnimated ? "animate-pulse" : "opacity-0"
            }`}
            style={{
              left: `${20 + i * 12}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
