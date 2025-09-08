"use client"

import { useRef } from "react";
import { motion } from "motion/react";

import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { HeroHighlight, Highlight } from "./ui/hero-highlight";

export function Conf() {
    const confettiRef = useRef<ConfettiRef>(null);

    return (
        <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl tracking-tight sm:text-8xl font-semibold leading-none dark:from-white dark:to-slate-900/10">
                The End.
            </span>
            {/* <p className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-2xl font-semibold leading-none dark:from-white dark:to-slate-900/10">
            You've reached the end, now hire me
        </p> */}
            <HeroHighlight>
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: [20, -5, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-sm tracking-tight sm:text-2xl font-semibold leading-none dark:from-white dark:to-slate-900/10"
                >
                    You've reached the end.{" "}
                    <Highlight className="text-black dark:text-white">
                    Now hire me!
                    </Highlight>
                </motion.h1>
            </HeroHighlight>

            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full"
                onMouseEnter={() => {
                    confettiRef.current?.fire({});
                }}
            />
        </div>
    );
}