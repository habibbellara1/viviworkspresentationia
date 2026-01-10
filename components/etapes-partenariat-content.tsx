"use client"

import Image from "next/image"

export function EtapesPartenariatContent() {
  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col">
        {/* Header compact */}
        <div className="text-center py-2 flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Étapes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0671] to-[#ff3d8f]">partenariat</span>
          </h1>
        </div>

        {/* Conteneur de l'image */}
        <div className="flex-1 flex items-center justify-center min-h-0 px-4 pb-4">
          <div className="h-full w-full max-w-5xl flex items-center justify-center">
            <Image
              src="/WhatsApp Image 2026-01-07 at 23.31.56.jpeg"
              alt="Étapes de partenariat"
              width={1200}
              height={800}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
