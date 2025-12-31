"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const slides = [
  {
    id: 1,
    title: "Nos expertises",
    content: (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <Image
            src="/p1.jpeg"
            alt="Nos expertises - Services et compétences de Viviworks"
            width={1200}
            height={800}
            className="w-full h-auto max-h-[65vh] object-contain rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Un partenariat clé en main",
    content: (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 flex-1">
          {[
            { title: "GRAPHISME", desc: "Création de sites web personnalisés.", icon: "🎨" },
            { title: "RÉDACTION", desc: "Contenus web optimisés SEO.", icon: "✍️" },
            { title: "RESPONSIVE", desc: "Sites adaptés à tous appareils.", icon: "📱" },
            { title: "URL", desc: "URL courte et mémorable.", icon: "🔗" },
            { title: "HÉBERGEMENT", desc: "Hébergement OVH sécurisé.", icon: "🏠" },
            { title: "VISIBILITÉ", desc: "Diffusion GPS et annuaires.", icon: "👁️" },
            { title: "VISITES", desc: "Statistiques de visites.", icon: "📊" },
            { title: "RÉFÉRENCEMENT", desc: "Optimisation SEO.", icon: "📈" },
            { title: "MISE À JOUR", desc: "Outil de gestion contenu.", icon: "🔧" },
            { title: "VIVIWORKS&MOI", desc: "Suivi de votre dossier.", icon: "📋" },
            { title: "FORMATION", desc: "1h avec un formateur.", icon: "🎓" },
            { title: "ACCOMPAGNEMENT", desc: "Support continu.", icon: "🤝" },
          ].map((service, index) => (
            <Card key={index} className="bg-white border border-gray-200 hover:border-[#FF0671] hover:shadow-md transition-all duration-300">
              <CardContent className="p-2 md:p-3 text-center">
                <div className="text-xl md:text-2xl mb-1">{service.icon}</div>
                <h3 className="font-bold text-black mb-1 text-[10px] md:text-xs">{service.title}</h3>
                <p className="text-[8px] md:text-[10px] text-gray-600 leading-tight">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-lg mt-3">
          <div className="flex flex-col lg:flex-row items-center gap-3 md:gap-4">
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold mb-2 text-black">ViviworksDiffusion</h3>
              <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                Simplifiez la gestion de votre présence internet grâce à une solution centralisée. 
                Diffusez vos coordonnées sur Google My Business, Google Maps, Facebook, Waze...
              </p>
            </div>
            <div className="w-full lg:w-48 h-24 md:h-32 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/WhatsApp Image 2025-12-26 at 09.34.06.jpeg"
                alt="ViviworksDiffusion"
                width={200}
                height={130}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Nos outils préférés",
    content: (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <Image
            src="/WhatsApp Image 2025-12-30 at 06.49.52.jpeg"
            alt="Nos outils préférés - Technologies et plateformes utilisées"
            width={1200}
            height={800}
            className="w-full h-auto max-h-[65vh] object-contain rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>
    ),
  },
]

export function ViviworksContent() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-lg p-3 md:p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-3 md:mb-4 gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 bg-transparent order-2 sm:order-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Précédent</span>
          </Button>

          <h1 className="text-lg md:text-2xl font-bold text-center text-gray-900 order-1 sm:order-2">
            {slides[currentSlide].title}
          </h1>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 bg-transparent order-3"
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">{slides[currentSlide].content}</div>

        {/* Indicateurs de slides */}
        <div className="flex justify-center gap-2 mt-3 flex-shrink-0">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
