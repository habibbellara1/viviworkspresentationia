"use client"

import React from "react"
import Image from "next/image"

interface ViviworksLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  showTagline?: boolean
  className?: string
}

export function ViviworksLogo({ size = "md", showTagline = true, className = "" }: ViviworksLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20",
    "2xl": "w-32 h-32"
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl",
    "2xl": "text-2xl"
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo image */}
      <div className={`relative ${sizeClasses[size]} ${showTagline ? 'mb-2' : ''}`}>
        <Image
          src="/vivi.png"
          alt="Viviworks Digital Marketing"
          width={80}
          height={80}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Texte du logo - seulement si showTagline est true */}
      {showTagline && (
        <div className="text-center">
          <div className={`font-bold uppercase tracking-wide text-black ${textSizes[size]}`}>
            VIVIWORKS
          </div>
          <div className={`font-medium uppercase tracking-wide text-[#FF0671] text-xs ${size === "sm" ? "text-xs" : size === "md" ? "text-xs" : "text-sm"}`}>
            DIGITAL MARKETING
          </div>
        </div>
      )}
    </div>
  )
} 