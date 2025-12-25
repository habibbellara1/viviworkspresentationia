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
      <div className="space-y-8 md:space-y-12">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Image
              src="/Nos expertises.png"
              alt="Nos expertises - Services et compétences de Viviworks"
              width={1200}
              height={800}
              className="w-full h-auto rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Un partenariat clé en main",
    content: (
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "GRAPHISME", desc: "Création de sites web personnalisés et adaptés à vos besoins.", icon: "🎨" },
            { title: "RÉDACTION", desc: "Création de contenus web optimisés pour le référencement.", icon: "✍️" },
            {
              title: "RESPONSIVE DESIGN",
              desc: "Tous nos sites s'adaptent automatiquement à l'appareil utilisé.",
              icon: "📱",
            },
            {
              title: "URL",
              desc: "Une url courte, facile à mémoriser et qui correspond à votre entreprise.",
              icon: "🔗",
            },
            {
              title: "HÉBERGEMENT",
              desc: "Nous hébergeons l'intégralité des sites web de nos clients chez OVH, leader européen.",
              icon: "🏠",
            },
            {
              title: "VISIBILITÉ",
              desc: "Diffusion locale de vos coordonnées sur les GPS et annuaires majeurs.",
              icon: "👁️",
            },
            {
              title: "VISITES",
              desc: "Des compteurs sont intégrés sur chaque site, pour connaître les statistiques de visites.",
              icon: "📊",
            },
            {
              title: "RÉFÉRENCEMENT",
              desc: "Accompagnement et optimisation de votre site web pour le référencement.",
              icon: "📈",
            },
            {
              title: "OUTIL DE MISE À JOUR",
              desc: "Un outil dédié afin que vous puissiez ajouter des photos, des vidéos, des actualités, des contenus, etc.",
              icon: "🔧",
            },
            {
              title: "COMPTE VIVIWORKS&MOI",
              desc: "Suivi de votre dossier, transmission d'éléments, création de demande support et accès aux statistiques.",
              icon: "📋",
            },
            {
              title: "FORMATION",
              desc: "Vous bénéficiez d'une heure avec un formateur à distance pour prendre en main l'outil.",
              icon: "🎓",
            },
            {
              title: "ACCOMPAGNEMENT",
              desc: "À l'écoute de vos besoins tout au long de notre partenariat.",
              icon: "🤝",
            },
          ].map((service, index) => (
            <Card key={index} className="bg-white border border-gray-200 hover:border-[#FF0671] hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl mb-2 md:mb-3">{service.icon}</div>
                <h3 className="font-bold text-black mb-2 text-sm md:text-base">{service.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-black">ViviworksDiffusion</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                L'outil créé par viviworks vous permet de simplifier la gestion de votre présence internet grâce à une
                solution centralisée des mises à jour de vos informations. Vous pouvez diffuser vos coordonnées sur les
                GPS et annuaires majeurs comme l'annuaire de viviworks, Google My Business, Google Maps, Facebook,
                Waze...
              </p>
              <p className="text-gray-600 mt-4 text-sm md:text-base">
                En plus du gain de temps réalisé cela vous assure sécurité, fiabilité et cohérence dans votre
                communication web.
              </p>
            </div>
            <div className="w-full lg:w-80 h-48 md:h-60 bg-gradient-to-br from-black to-[#FF0671] rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-white text-center">
                <div className="text-3xl md:text-4xl mb-2">🌐</div>
                <div className="font-bold text-sm md:text-base">ViviworksDiffusion</div>
              </div>
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
      <div className="space-y-8 md:space-y-12">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Image
              src="/images/nos-outils-preferes-white.png"
              alt="Nos outils préférés - Technologies et plateformes utilisées sur fond blanc"
              width={1200}
              height={800}
              className="w-full h-auto rounded-2xl shadow-lg"
              priority
            />
          </div>
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
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 min-h-[600px]">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
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

          <h1 className="text-xl md:text-3xl font-bold text-center text-gray-900 order-1 sm:order-2">
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

        <div className="mb-6 md:mb-8">{slides[currentSlide].content}</div>

        {/* Indicateurs de slides */}
        <div className="flex justify-center gap-2">
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
