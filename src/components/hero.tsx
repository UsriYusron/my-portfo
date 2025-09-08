import { Button } from "@/components/ui/button"

export function Hero() {
  // const buttonNew = (

  // )

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">FROM LINE OF CODE</span>
            <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">T0 DIGITAL EXPERIENCE</span>
          </h1>
          <div className="mt-6">
            <Button asChild className="rounded-full bg-lime-400 px-6 text-black hover:bg-lime-300 mr-3">
              <a href="https://wa.me/6283827406460" target="_blank" rel="noopener noreferrer">
                Chat With Me
              </a>
            </Button>
            <Button asChild className="rounded-full bg-purple-400 px-6 text-black hover:bg-purple-300 mr-3">
              <a href="/cv/CV - MUHAMAD USRI YUSRON.pdf" target="_blank" rel="noopener noreferrer">
                Download My CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
