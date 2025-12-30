"use client"

import { useState, useEffect } from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"

interface PricingItem {
  id: string
  category: string
  description: string
  price: number
  periodicity: string
  canBeOffered: boolean
  isOffered: boolean
  monthlyExtra?: number
}

// Prix par défaut
const defaultPricingItems: PricingItem[] = [
  {
    id: "site-vitrine",
    category: "Site vitrine",
    description: "Conception du site vitrine (graphisme et rédactionnel) responsive design",
    price: 2350,
    periodicity: "Versement unique",
    canBeOffered: true,
    isOffered: false
  },
  {
    id: "nom-domaine",
    category: "Nom de domaine",
    description: "Nom de domaine personnalisé et adresse e-mail associée",
    price: 30,
    periodicity: "Annuel",
    canBeOffered: true,
    isOffered: false
  },
  {
    id: "hebergement",
    category: "Hébergement, administration et référencement",
    description: `• Optimisation des sites pour les moteurs de recherche (Google, Yahoo, Bing...) : contenus structurés et optimisés, maillage interne.
• Hébergement
• Certificat SSL permettant une navigation sécurisée (https)
• Mises à jour de contenu illimitées
• Mise à disposition du gestionnaire de contenu Webtool
• Evolutions fonctionnelles de la plateforme Webtool
• Accompagnement personnalisé par un expert local.fr
• Accompagnement par un expert en référencement local.fr
• Assistance du lundi au vendredi par téléphone et e-mail
• Accès aux statistiques de visite
• Campagne Google Ads
• Accès à l'espace partenaire local&moi
• Accompagnement dans la Création de votre page FB et GMB
• Diffusion des coordonnées sur les annuaires et GPS majeurs (Facebook, Google My Business, Google Maps et Waze)
• Estimation du marché
• Optimisations par du référencement naturel et du référencement payant
• Garantie de visites incluse pendant 12 mois (100 visites/mois moyenne annuelle mensualisée sur 12 mois)`,
    price: 134,
    periodicity: "Mensuel",
    canBeOffered: false,
    isOffered: false,
    monthlyExtra: 100
  },
  {
    id: "communication",
    category: "Communication Web",
    description: "• Annuaire local.fr",
    price: 432,
    periodicity: "Versement unique",
    canBeOffered: true,
    isOffered: false
  },
  {
    id: "formation",
    category: "Formation",
    description: "• Prendre en main l'outil de mise à jour Webtool",
    price: 95,
    periodicity: "Versement unique",
    canBeOffered: true,
    isOffered: false
  },
  {
    id: "frais-mise-en-oeuvre",
    category: "Frais de mise en oeuvre",
    description: "• Site jusqu'à 10 pages",
    price: 449,
    periodicity: "Versement unique",
    canBeOffered: false,
    isOffered: false
  }
]

const durations = ["12 MOIS", "24 MOIS", "36 MOIS", "48 MOIS", "60 MOIS"]

export function OffrePartenariatContent() {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>(defaultPricingItems)
  const [selectedDuration, setSelectedDuration] = useState("60 MOIS")
  const [currentPage, setCurrentPage] = useState(0)
  const [offeredItems, setOfferedItems] = useState<Set<string>>(new Set())

  // Charger la configuration depuis localStorage
  useEffect(() => {
    const savedPricing = localStorage.getItem('viviworks-offre-pricing')
    if (savedPricing) {
      try {
        const pricing = JSON.parse(savedPricing)
        if (pricing.items) {
          // Merger avec les descriptions complètes par défaut
          const mergedItems = defaultPricingItems.map(defaultItem => {
            const savedItem = pricing.items.find((i: PricingItem) => i.id === defaultItem.id)
            if (savedItem) {
              return {
                ...defaultItem,
                price: savedItem.price,
                canBeOffered: savedItem.canBeOffered,
                isOffered: savedItem.isOffered,
                monthlyExtra: savedItem.monthlyExtra ?? defaultItem.monthlyExtra
              }
            }
            return defaultItem
          })
          setPricingItems(mergedItems)
          
          // Initialiser les items offerts par défaut
          const defaultOffered = new Set<string>()
          mergedItems.forEach(item => {
            if (item.isOffered) {
              defaultOffered.add(item.id)
            }
          })
          setOfferedItems(defaultOffered)
        }
        if (pricing.duration) {
          setSelectedDuration(pricing.duration)
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error)
      }
    }
  }, [])

  const toggleOffer = (id: string) => {
    const item = pricingItems.find(i => i.id === id)
    if (!item?.canBeOffered) return
    
    const newOffered = new Set(offeredItems)
    if (newOffered.has(id)) {
      newOffered.delete(id)
    } else {
      newOffered.add(id)
    }
    setOfferedItems(newOffered)
  }

  // Calculer les économies
  const calculateSavings = () => {
    let total = 0
    pricingItems.forEach(item => {
      if (offeredItems.has(item.id)) {
        total += item.price
      }
    })
    return total
  }

  // Calculer le total mensuel
  const getMonthlyPrice = () => {
    const hebergement = pricingItems.find(i => i.id === "hebergement")
    return hebergement ? hebergement.price : 134
  }

  // Calculer les frais uniques
  const getOneTimePrice = () => {
    const frais = pricingItems.find(i => i.id === "frais-mise-en-oeuvre")
    return frais && !offeredItems.has(frais.id) ? frais.price : 0
  }

  const totalSavings = calculateSavings()

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header avec sélecteur de durée */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF0671] focus:border-transparent bg-white"
            >
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            <span className="text-lg font-bold text-gray-800">LOCALAUDIENCE</span>
          </div>
          
          <div className="flex items-center gap-12 text-sm font-semibold text-gray-600">
            <span>Budget HT</span>
            <span>Périodicité</span>
          </div>
        </div>

        {/* Contenu du tableau de prix */}
        <div className="p-6">
          {pricingItems.map((item) => {
            const isOffered = offeredItems.has(item.id)
            
            return (
              <div key={item.id} className="mb-6 last:mb-0">
                {/* Titre de la catégorie */}
                <h3 className="text-lg font-bold italic mb-3 text-[#FF0671]">
                  {item.category}
                </h3>

                {/* Item */}
                <div className="flex items-start justify-between py-4 border-b border-gray-100">
                  {/* Description */}
                  <div className="flex-1 pr-8 max-w-[60%]">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Prix et périodicité */}
                  <div className="flex items-start gap-4 flex-shrink-0">
                    {/* Budget HT - Cliquable si peut être offert */}
                    <div 
                      className={`text-right min-w-[120px] ${item.canBeOffered ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={() => item.canBeOffered && toggleOffer(item.id)}
                    >
                      <div className="flex flex-col items-end">
                        {/* Prix original */}
                        <span className={`text-sm font-medium transition-all duration-300 ${
                          isOffered ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}>
                          {item.price}€
                        </span>
                        
                        {/* Extra mensuel si applicable */}
                        {item.monthlyExtra && (
                          <span className={`text-xs mt-1 transition-all duration-300 ${
                            isOffered ? 'line-through text-gray-400' : 'text-gray-500'
                          }`}>
                            + {item.monthlyExtra}€ / Mois pendant 12 mois
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prix offre (0€) - Apparaît seulement quand offert */}
                    <div className="min-w-[80px] flex justify-center">
                      {isOffered ? (
                        <span 
                          className="inline-block px-4 py-1 rounded-full text-white font-bold text-sm cursor-pointer"
                          style={{ backgroundColor: "#FF0671" }}
                          onClick={() => toggleOffer(item.id)}
                        >
                          0€
                        </span>
                      ) : !item.canBeOffered ? (
                        <span 
                          className="inline-block px-4 py-1 rounded-full text-white font-bold text-sm"
                          style={{ backgroundColor: "#FF0671" }}
                        >
                          {item.price}€
                        </span>
                      ) : null}
                    </div>

                    {/* Périodicité */}
                    <div className="text-right min-w-[100px]">
                      <span className="text-gray-600 text-sm">
                        {item.periodicity}
                      </span>
                      {item.periodicity === "Mensuel" && (
                        <div className="text-[#FF0671] text-xs font-medium mt-1">
                          Mensuel
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Navigation pages */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-5 h-5 text-[#FF0671]" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#FF0671]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
