"use client"

import { Key, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

type Feature = { text: string; muted?: boolean }

interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  tech: string[];
}

const ACCENT = "#C6FF3A"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-500" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

export function Project() {
  const [Projects, setProjects] = useState<Project[]>([]);

  const [showAll, setShowAll] = useState(false);
  const initialItemsToShow = 3;
  const displayedProjects = showAll ? Projects : Projects.slice(0, initialItemsToShow);

  // Ambil semua data
  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section id="project" className="text-white" itemScope itemType="https://schema.org/PriceSpecification">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            My Projects.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-400" itemProp="description">
            No copyright issues. Evaluate my work and hire me to join your team.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {displayedProjects.map((project) => (
            <Card
              key={project.name}
              className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <CardHeader className="space-y-3 pb-4">
                <Image src={project.image} alt={project.name} width={500} height={300} className="w-full h-48 object-cover" />

                <div className="text-md font-bold text-white" itemProp="name" title={project.name}>
                  {project.name}
                </div>

                <Link href={project.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="flex-1 rounded-full text-sm font-medium transition-colors">
                    Open On Github
                  </Button>
                </Link>
              </CardHeader>

              <CardContent className="pt-0">
                <h3 className="text-md font-bold text-white mb-1">Tech Stack:</h3>
                <ul className="grid grid-cols-2" itemProp="description">
                  {project.tech && project.tech.map((techName: string, index: Key | null | undefined) => (
                    <FeatureItem key={index} text={techName} />
                  ))}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          ))}
        </div>

        {Projects.length > initialItemsToShow && (
          <div className="mt-8 text-center">
            <Button onClick={() => setShowAll(!showAll)} variant="default">
              {showAll ? 'Hide Project' : 'See More...'}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
