"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

export function LogoMarquee() {
  const [pausedRow, setPausedRow] = useState<string | null>(null)

  // Logo data with colors and content
  const logos = [
    { name: "PHP", content: "image", color: "text-neutral-300", image: "/images/php.svg" },
    { name: "MongoDB", content: "image", color: "text-green-500", image: "/images/mongo.svg" },
    { name: "Laravel", content: "image", color: "text-neutral-300", image: "/images/laravel.svg" },
    { name: "Python", content: "image", color: "text-white", bg: "bg-blue-500", image: "/images/python.svg" },
    { name: "Next.js", content: "image", color: "text-neutral-300", image: "/images/next.svg" },
    { name: "Javascript", content: "image", color: "text-yellow-500", image: "/images/js.svg" },
    { name: "Github", content: "image", color: "text-neutral-300", image: "/images/github.svg" },
    { name: "OpenCV", content: "image", color: "text-white", bg: "bg-green-500", image: "/images/open.svg" },
  ]

  const secondRowLogos = [
    { name: "Taiwind", content: "image", color: "text-neutral-300", image: "/images/tailwind.svg" },
    { name: "Microsoft", content: "⊞", color: "text-neutral-400" },
    { name: "CleanMyMac", content: "🌈", color: "text-purple-400" },
    { name: "Google", content: "G", color: "text-neutral-300" },
    { name: "Behance", content: "Be", color: "text-white", bg: "bg-blue-500" },
    { name: "Apple", content: "🍎", color: "text-neutral-300" },
    { name: "TransferWise", content: "✓", color: "text-white", bg: "bg-green-500" },
    { name: "Medium", content: "M", color: "text-neutral-300" },
  ]

  const LogoCard = ({ logo, rowId }: { logo: any; rowId: string }) => (
    <div
      className="flex-shrink-0 mx-3"
      onMouseEnter={() => setPausedRow(rowId)}
      onMouseLeave={() => setPausedRow(null)}
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center">
        {logo.image ? (
          <div className="relative w-16 h-8 sm:w-20 sm:h-10 lg:w-24 lg:h-12">
            <Image
              src={logo.image || "/placeholder.svg"}
              alt={logo.name}
              fill
              className="object-contain opacity-90"
              sizes="(min-width: 1024px) 128px, (min-width: 640px) 112px, 96px"
            />
          </div>
        ) : logo.bg ? (
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${logo.bg} flex items-center justify-center`}>
            <span className={`text-sm sm:text-lg font-bold ${logo.color}`}>{logo.content}</span>
          </div>
        ) : (
          <span className={`text-lg sm:text-xl lg:text-2xl font-semibold ${logo.color}`}>{logo.content}</span>
        )}
      </div>
    </div>
  )

  return (
    <section className="text-white py-16 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-12 sm:flex-row sm:items-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl text-center sm:text-left">
            Know my <span className="text-lime-300">top-tier</span>
            <br />
            technologies
          </h2>
          <Button variant="outline" className="mt-4 sm:mt-0 liquid-glass hover:liquid-glass-enhanced bg-transparent">
            Learn More
          </Button>
        </div>

        {/* Logo Marquee */}
        <div className="relative">
          {/* First Row - Scrolling Right */}
          <div className="flex overflow-hidden mb-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className={`flex animate-scroll-right whitespace-nowrap ${pausedRow === "first" ? "animation-play-state-paused" : ""}`}
              style={{
                animationPlayState: pausedRow === "first" ? "paused" : "running",
                width: "max-content",
              }}
            >
              {/* Triple the logos for seamless loop */}
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <LogoCard key={`first-${index}`} logo={logo} rowId="first" />
              ))}
            </div>
          </div>

          {/* Second Row - Scrolling Left */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className={`flex animate-scroll-left whitespace-nowrap ${pausedRow === "second" ? "animation-play-state-paused" : ""}`}
              style={{
                animationPlayState: pausedRow === "second" ? "paused" : "running",
                width: "max-content",
              }}
            >
              {/* Triple the logos for seamless loop */}
              {[...secondRowLogos, ...secondRowLogos, ...secondRowLogos].map((logo, index) => (
                <LogoCard key={`second-${index}`} logo={logo} rowId="second" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
