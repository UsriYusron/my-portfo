"use client";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import {Self} from "@/components/self";
import { Skill } from "@/components/skill";
import Projects from "@/components/projects";
import Certificates from "@/components/certificates";
import {Footer} from "@/components/footer";
import Loader from "@/components/Loader";
import {Conf} from "@/components/end-confetti"

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The content is ready, so we can stop loading.
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="min-h-[100dvh] text-white">
          <SiteHeader />
          <Hero />
          <Self />
          <Skill />
          <Projects />
          <Certificates />
          <Conf />
          <Footer />
        </main>
      )}
    </>
  );
}
