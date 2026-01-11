"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  "/WhatsApp Image 2026-01-07 at 23.31.56.jpeg",
  "/WhatsApp Image 2026-01-10 at 20.57.47.jpeg",
  "/WhatsApp Image 2026-01-10 at 20.57.48.jpeg"
]

export function EtapesPartenariatContent() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col">
        {/* Header compact */}
        <div className="text-center py-2 flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Étapes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0671] to-[#ff3d8f]">partenariat</span>
          </h1>
        </div>

        {/* Conteneur de l'image avec navigation */}
        <div className="flex-1 flex items-center justify-center min-h-0 px-4 pb-4 relative">
          {/* Bouton précédent */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-6 z-10 p-2 sm:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0671]" />
          </button>

          {/* Image */}
          <div className="h-full w-full max-w-5xl flex items-center justify-center">
            <Image
              src={images[currentIndex]}
              alt={`Étape ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
              priority
            />
          </div>

          {/* Bouton suivant */}
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-6 z-10 p-2 sm:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0671]" />
          </button>
        </div>

        {/* Indicateurs de page */}
        <div className="flex justify-center gap-2 pb-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-[#FF0671] scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
