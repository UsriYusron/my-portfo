"use client";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import {Self} from "@/components/self";
import { Skill } from "@/components/skill";
import { Project } from "@/components/projects";
import { Certificate } from "@/components/certificate";
import {Footer} from "@/components/footer";
import Loader from "@/components/Loader";
import {Conf} from "@/components/end-confetti"

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulate a 3 second loading time

    return () => clearTimeout(timer);
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
          <Project />
          <Certificate />
          <Conf />
          <Footer />
        </main>
      )}
    </>
  );
}
