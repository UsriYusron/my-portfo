"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import Image from "next/image"

import { TextReveal } from "@/components/ui/text-reveal"
import { Lens } from "@/components/ui/lens"

interface Certificate {
  id: string;
  publisher: string;
  yearGet: string;
  yearEnd: string;
  link: string;
  image: string;
  description: string;
  title: string;
}

export function Certificate() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [showAll, setShowAll] = useState(false);
  const initialItemsToShow = 3;
  const displayedCertificats = showAll ? certs : certs.slice(0, initialItemsToShow);

  // Ambil semua data
  async function fetchCerts() {
    const res = await fetch("/api/certificates");
    const data = await res.json();
    setCerts(data);
  }

  useEffect(() => {
    fetchCerts();
  }, []);

  return (
    <section className="">
      {/* Contact CTA */}
      <div className="container mx-auto">
        <TextReveal>You&apos;ve scrolled this far but you&apos;re not sure for hiring me 🤔?</TextReveal>
      </div>

      <div className="mx-auto max-w-3xl text-center" id="certificate">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
          My Certificates.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-400" itemProp="description">
          Let me prove my skills to convince you.
        </p>
        <div className="mt-6">
          <Button
            asChild
            className="rounded-full px-5 text-neutral-900 hover:brightness-95"
            style={{ backgroundColor: "#f2f2f2" }}
          >
            <Link href="https://wa.me/6283827406460" target="_blank">
              Contact me now
            </Link>
          </Button>
        </div>
      </div>

      {/* Download the app */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="grid place-items-center gap-6 lg:grid-cols-3">
            {/* card image */}
            {displayedCertificats.map((cert) => (
              <Card className="relative max-w-md shadow-none" key={cert.title}>
                <CardHeader>
                  <Lens
                    zoomFactor={2}
                    lensSize={150}
                    isStatic={false}
                    ariaLabel="Zoom Area"
                  >
                    <Image
                      src={cert.image}
                      alt={cert.publisher}
                      width={500}
                      height={500}
                    />
                  </Lens>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl font-semibold">{cert.publisher}</CardTitle>
                  <CardDescription>
                    {cert.title}
                  </CardDescription>
                </CardContent>
                <CardFooter className="space-x-4">
                  <Link href={cert.link} target="_blank" rel="noopener noreferrer" className="space-x-4">
                    <Button>Open the Credential</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {certs.length > initialItemsToShow && (
            <div className="mt-8 text-center">
              <Button onClick={() => setShowAll(!showAll)} variant="default">
                {showAll ? 'Hide Certificate' : 'See More...'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
