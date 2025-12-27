"use client";

import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradientSize?: number;
    gradientColor?: string;
    gradientOpacity?: number;
    gradientBorderWidth?: number;
    maskClassName?: string;
}

/**
 * MagicCard Component
 * 
 * Een premium interactieve card met een diepe, matte donkergroene glow.
 * Geoptimaliseerd voor maximale zichtbaarheid en luxe uitstraling.
 * 
 * Kleur: #115e3a (Diep Bosgroen) met hoge alpha voor rijke verzadiging.
 */
export function MagicCard({
    children,
    className,
    gradientSize = 350, // Groot bereik voor een zachte, prominente gloed
    gradientColor = "#115e3aff", // Exacte match met brand button, hoge alpha
    gradientOpacity = 1, // Maximale dekking (wordt geregeld via framer motion states)
    gradientBorderWidth = 1.5, // Iets dunnere rand (was 3px)
    maskClassName,
    ...props
}: MagicCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(-gradientSize);
    const mouseY = useMotionValue(-gradientSize);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (cardRef.current) {
                const { left, top } = cardRef.current.getBoundingClientRect();
                mouseX.set(e.clientX - left);
                mouseY.set(e.clientY - top);
            }
        },
        [mouseX, mouseY],
    );

    const handleMouseLeave = useCallback(() => {
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
    }, [mouseX, mouseY, gradientSize]);

    useEffect(() => {
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
    }, [gradientSize, mouseX, mouseY]);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative flex size-full overflow-hidden rounded-lg bg-transparent transition-all duration-300",
                "shadow-sm hover:shadow-lg dark:shadow-none", // Subtiele lift effect
                className,
            )}
            {...props}
        >
            {/* 
              1. ACHTERGROND LAAG (De Glow) 
              De gradient laag die fungeert als border door de maskering.
            */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 85%)
                    `,
                    opacity: gradientOpacity,
                    willChange: "opacity, transform",
                    filter: "blur(10px)", // Premium soft blur (8-12px range)
                }}
                // Duidelijk zichtbaar in rust (0.85), volledig op hover (1.0)
                initial={{ opacity: 0.85 }}
                whileHover={{ opacity: 1 }}
            />

            {/* 
              2. MASKER LAAG (Card Inhoud Achtergrond)
              Bedekt het midden van de card zodat alleen de rand ("border") zichtbaar is.
            */}
            <div
                className={cn(
                    "absolute z-10 rounded-[6px] bg-card transition-all duration-300",
                    maskClassName
                )}
                style={{
                    // Dynamische inset voor dikkere rand
                    top: gradientBorderWidth,
                    left: gradientBorderWidth,
                    right: gradientBorderWidth,
                    bottom: gradientBorderWidth,
                }}
            />

            {/* 
              3. CONTENT LAAG 
              De daadwerkelijke tekst en iconen.
            */}
            <div className="relative z-20 size-full">
                {children}
            </div>
        </div>
    );
}
