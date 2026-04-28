"use client";
import { useEffect, useRef, useState } from "react";

const phrases = [
    "are backed by evidence",
    "exceed expectations",
    "are tailored to your goals",
    "are goal driven",
    "are tailored for every athlete",
    "align with your lifestyle",
    "just work…",
];

export default function HeroRotator() {
    const rotatorRef = useRef(null);
    const slotRef = useRef(null);

    const [index, setIndex] = useState(0);
    const speed = 900;
    const pause = 2400;

    // ✅ Lock width (prevent layout shift)
    useEffect(() => {
        const rotator = rotatorRef.current;
        const slot = slotRef.current;

        if (!rotator || !slot) return;

        const probe = document.createElement("span");

        Object.assign(probe.style, {
            position: "absolute",
            visibility: "hidden",
            whiteSpace: "nowrap",
            fontFamily: getComputedStyle(slot).fontFamily,
            fontSize: getComputedStyle(slot).fontSize,
            fontWeight: getComputedStyle(slot).fontWeight,
        });

        document.body.appendChild(probe);

        let max = 0;
        phrases.forEach((p) => {
            probe.textContent = p;
            max = Math.max(max, probe.getBoundingClientRect().width);
        });

        rotator.style.minWidth = Math.ceil(max) + "px";
        probe.remove();
    }, []);

    // ✅ Animation loop
    useEffect(() => {
        const rotator = rotatorRef.current;

        if (!rotator) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReduced) return;

        const interval = setInterval(() => {
            rotator.classList.add("rotator--out");

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % phrases.length);

                rotator.classList.remove("rotator--out");
                rotator.classList.add("rotator--in");

                setTimeout(() => {
                    rotator.classList.remove("rotator--in");
                }, speed);
            }, speed);
        }, speed + pause);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <span className="rotator px-2" ref={rotatorRef} aria-hidden="true">
                Search for &nbsp;
                <span className="rotator__item" ref={slotRef}>
                    {phrases[index]}
                </span>
            </span>
        </>
    );
}