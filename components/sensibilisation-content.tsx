"use client"

import Image from "next/image"

export function SensibilisationContent() {
  return (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto p-2 md:p-4 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src="/images/sensibilisation.png"
          alt="Statistiques sur les habitudes numériques des français"
          width={1200}
          height={800}
          className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-lg"
          priority
        />
      </div>
    </div>
  )
}
