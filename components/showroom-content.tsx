"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Monitor, Globe, Image as ImageIcon } from "lucide-react"
import { useEffect } from "react"

export function ShowroomContent() {
  const websites = [
    {
      id: "ecoclimatic",
      name: "Eco Climatic",
      url: "http://ecoclimatic.fr/",
      description: "Site web pour une entreprise de climatisation écologique",
      image: "/ecoclimatic.png",
      category: "Climatisation"
    },
    {
      id: "stratelink",
      name: "Stratelink Global",
      url: "#",
      description: "Stratelink Global est un partenaire stratégique connectant Dubaï, l'Europe et l'Asie",
      image: "/stratelink.png",
      category: "Conseil & Développement"
    },
    {
      id: "wakeupacademy",
      name: "Wake Up Academy",
      url: "https://wakeupacademy.fr/",
      description: "Site web pour une académie de formation et développement personnel",
      image: "/wakeupacademy.png",
      category: "Formation"
    },
    {
      id: "farem",
      name: "Farem",
      url: "https://faremvoyage.com/",
      description: "Site vitrine moderne pour présenter l'activité et générer des leads",
      image: "/farm.png",
      category: "Voyage & Tourisme"
    },
    {
      id: "republichild",
      name: "Republichild",
      url: "https://republichild.com/",
      description: "Développement personnel des enfants et accompagnement parental basé sur les neurosciences",
      image: "/republichild.png",
      category: "Éducation & Parentalité"
    },
    {
      id: "asr-nettoyage",
      name: "ASR Nettoyage",
      url: "https://www.asr-nettoyage.fr/agence-de-cergy/",
      description: "Agence de nettoyage professionnel à Cergy",
      image: "/asrNettoyage.png",
      category: "Nettoyage"
    },
    {
      id: "perf-renovation",
      name: "Perf Rénovation",
      url: "https://perf-renovation.fr/",
      description: "Entreprise spécialisée dans la rénovation",
      image: "/prefRénovation.png",
      category: "Rénovation"
    },
    {
      id: "miaosteria",
      name: "Mia Osteria",
      url: "https://www.miaosteria-cergy.com/",
      description: "Restaurant italien à Cergy",
      image: "/miaOsteria.png",
      category: "Restauration"
    },
    {
      id: "coiffurechicaboom",
      name: "Coiffure Chica Boom",
      url: "https://coiffurechicaboom.com/",
      description: "Salon de coiffure",
      image: "/CoiffurechicaBoom.png",
      category: "Coiffure"
    },
    {
      id: "mte95",
      name: "MTE 95",
      url: "https://mte95.fr/",
      description: "Maintenance et travaux électriques",
      image: "/Mte maintenance et traveau electriques .png",
      category: "Électricité"
    },
    {
      id: "plomberie-petroque",
      name: "Plomberie Pétroque",
      url: "https://plomberiepetroque.fr/",
      description: "Services de plomberie professionnels",
      image: "/plomberie pétroque.png",
      category: "Plomberie"
    },
    {
      id: "agence-principale-cergy",
      name: "Agence Principale Cergy",
      url: "https://www.agenceprincipalecergy.com/",
      description: "Agence immobilière à Cergy",
      image: "/agencePrincipalecergy.png",
      category: "Immobilier"
    },
    {
      id: "motrio",
      name: "Motrio",
      url: "https://www.motrio.fr/",
      description: "Entretien auto, réparations et pièces de qualité",
      image: "/Motrio.png",
      category: "Automobile"
    }
  ]

  useEffect(() => {
    // Test des chemins d'images
    websites.forEach(site => {
      console.log('Test image:', site.image)
      const img = new Image()
      img.onload = () => console.log('✅ Image chargée:', site.image)
      img.onerror = () => console.error('❌ Erreur image:', site.image)
      img.src = site.image
    })
  }, [])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Erreur de chargement image:', e.currentTarget.src)
    e.currentTarget.style.display = 'none'
    const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback')
    if (fallback) {
      fallback.classList.remove('hidden')
    }
  }

  const handleVisitSite = (url: string) => {
    if (url === "#") {
      // Pour Stratelink, on peut afficher un message ou ne rien faire
      console.log("Site Stratelink en cours de développement")
      return
    }
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
          Showroom Viviworks
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl">
          Découvrez nos réalisations web. Chaque site est conçu avec soin pour répondre 
          aux besoins spécifiques de nos clients et optimiser leur présence en ligne.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {websites.map((site) => (
          <Card 
            key={site.id} 
            className="bg-white border border-gray-200 hover:border-[#4fafc4] transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">
                      {site.name}
                    </CardTitle>
                <span className="text-xs bg-[#4fafc4] text-white px-2 py-1 rounded-full">
                      {site.category}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                {site.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Image cadrée avec styles explicites */}
              <div className="relative w-full h-48 sm:h-56 md:h-48 lg:h-52 mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                <img
                  src={site.image}
                  alt={`Aperçu du site ${site.name}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onError={handleImageError}
                />
                
                {/* Fallback si l'image ne charge pas */}
                <div className="image-fallback hidden absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Image non disponible</p>
                    <p className="text-xs mt-1">{site.image}</p>
                  </div>
                </div>
                
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Globe className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2" />
                    <p className="text-sm font-medium">Voir le site</p>
                  </div>
                </div>
              </div>
              
              {/* Bouton pour visiter le site */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVisitSite(site.url)}
                className="w-full text-sm"
                disabled={site.url === "#"}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {site.url === "#" ? "Site en développement" : "Visiter le site"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section d'informations */}
      <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
          Nos réalisations web
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4fafc4] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-base sm:text-lg">🎨</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Design sur mesure</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Chaque site est conçu selon l'identité visuelle de votre entreprise
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#804d3b] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-base sm:text-lg">📱</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Responsive design</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Tous nos sites s'adaptent parfaitement aux mobiles et tablettes
            </p>
          </div>
          <div className="text-center sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-base sm:text-lg">⚡</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Performance optimisée</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Sites rapides et optimisés pour le référencement naturel
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 