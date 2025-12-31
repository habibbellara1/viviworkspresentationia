"use client"

import Image from "next/image"

export function SensibilisationContent() {
  return (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto p-2 md:p-4 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src="/WhatsApp Image 2025-12-30 at 06.36.22.jpeg"
          alt="Statistiques sur les habitudes numériques des français"
          width={1200}
          height={800}
          className="w-full h-auto max-h-[85vh] object-contain"
          priority
        />
      </div>
    </div>
  )
}
