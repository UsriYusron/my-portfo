"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Handshake, MessagesSquare, Rocket, Anchor, } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "What makes me the best candidate for you.",
  subtitle: "Discover my unique approach to web development",
}

export function Self() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("skitbit-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight sm:text-5xl">
        {content.title}
      </h2>

      <div className="">
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<BrainCircuit className="h-4 w-4" />}
            title="High Curiosity"
            description="Curiosity drives me to constantly ask 'why' and seek smarter, more efficient, and more innovative solutions to every challenge."
          />

          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={<Rocket className="h-4 w-4" />}
            title="High Initiative and Proactive"
            description="I am used to taking initiative, identifying potential problems before they occur, and actively seeking ways to deliver more value than expected."
          />

          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<Handshake className="h-4 w-4" />}
            title="Empathetic Communicator"
            description="I believe the best projects are born from deep understanding. I actively listen to truly understand your vision and needs, ensuring our collaboration runs smoothly and minimizes miscommunication."
          />

          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={<Anchor className="h-4 w-4" />}
            title="Calm and Resilient Under Pressure"
            description="Challenges are part of the process. I approach them with a cool head and a solution-oriented approach, ensuring all tasks remain stable and on track, even when faced with the unexpected."
          />

          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={<MessagesSquare className="h-4 w-4" />}
            title="Open Collaborator"
            description="I believe great ideas come from teamwork. I'm very open to input, enjoy discussions, and focus on collective success, not just individual triumphs."
          />
        </ul>
      </div>
    </section>
  )
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
 
const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 bg-black">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
