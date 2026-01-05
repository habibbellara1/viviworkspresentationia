"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

interface PricingItem {
  id: string
  category: string
  description: string
  price: number
  periodicity: string
  canBeOffered: boolean
  isOffered: boolean
  monthlyExtra?: number
  offerPrice?: number
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
    isOffered: false,
    offerPrice: 0
  },
  {
    id: "nom-domaine",
    category: "Nom de domaine",
    description: "Nom de domaine personnalisé et adresse e-mail associée",
    price: 30,
    periodicity: "Annuel",
    canBeOffered: true,
    isOffered: false,
    offerPrice: 0
  },
  {
    id: "hebergement",
    category: "Hébergement, administration et référencement",
    description: "Optimisation SEO, hébergement, SSL, mises à jour illimitées, Webtool, accompagnement expert, Google Ads, etc.",
    price: 134,
    periodicity: "Mensuel",
    canBeOffered: false,
    isOffered: false,
    monthlyExtra: 100
  },
  {
    id: "communication",
    category: "Communication Web",
    description: "Annuaire local.fr",
    price: 432,
    periodicity: "Versement unique",
    canBeOffered: true,
    isOffered: false,
    offerPrice: 0
  },
  {
    id: "formation",
    category: "Formation",
    description: "Prendre en main l'outil de mise à jour Webtool",
    price: 95,
    periodicity: "Versement unique",
    canBeOffered: true,
    isOffered: false,
    offerPrice: 0
  },
  {
    id: "frais-mise-en-oeuvre",
    category: "Frais de mise en oeuvre",
    description: "Site jusqu'à 10 pages",
    price: 449,
    periodicity: "Versement unique",
    canBeOffered: false,
    isOffered: false
  }
]

const durations = ["12 MOIS"]

export function OffrePartenariatContent() {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>(defaultPricingItems)
  const [selectedDuration, setSelectedDuration] = useState("12 MOIS")
  const [currentPage, setCurrentPage] = useState(0)
  const [offeredItems, setOfferedItems] = useState<Set<string>>(new Set())
  const [isOffreActive, setIsOffreActive] = useState(false)

  // Fonction pour charger la configuration
  const loadPricingConfig = async () => {
    try {
      // Essayer de charger depuis l'API (serveur)
      const response = await fetch('/api/pricing-config', { cache: 'no-store' })
      if (response.ok) {
        const serverConfig = await response.json()
        if (serverConfig && serverConfig.items && serverConfig.items.length > 0) {
          // Utiliser directement les items du serveur
          setPricingItems(serverConfig.items)
          
          const defaultOffered = new Set<string>()
          serverConfig.items.forEach((item: PricingItem) => {
            if (item.isOffered) {
              defaultOffered.add(item.id)
            }
          })
          setOfferedItems(defaultOffered)
          
          if (serverConfig.duration) {
            setSelectedDuration(serverConfig.duration)
          }
          return
        }
      }
    } catch (error) {
      console.error('Erreur API, fallback localStorage:', error)
    }
    
    // Fallback: charger depuis localStorage
    const savedPricing = localStorage.getItem('viviworks-offre-pricing')
    if (savedPricing) {
      try {
        const pricing = JSON.parse(savedPricing)
        if (pricing.items && pricing.items.length > 0) {
          // Utiliser directement les items du localStorage
          setPricingItems(pricing.items)
          
          const defaultOffered = new Set<string>()
          pricing.items.forEach((item: PricingItem) => {
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
        console.error('Erreur localStorage:', error)
      }
    }
  }

  // Charger la configuration depuis localStorage
  useEffect(() => {
    loadPricingConfig()
    
    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'viviworks-offre-pricing') {
        loadPricingConfig()
      }
    }
    
    // Écouter un événement personnalisé pour les changements dans le même onglet
    const handlePricingUpdate = () => {
      loadPricingConfig()
    }
    
    // Recharger quand la page devient visible (retour sur l'onglet)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPricingConfig()
      }
    }
    
    // Recharger quand la fenêtre reprend le focus
    const handleFocus = () => {
      loadPricingConfig()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('offre-pricing-updated', handlePricingUpdate)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('offre-pricing-updated', handlePricingUpdate)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const toggleOffer = (id: string) => {
    // Ne rien faire si le mode offre n'est pas activé
    if (!isOffreActive) return
    
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

  // Activer/désactiver le mode offre de partenariat
  const toggleOffrePartenariat = () => {
    if (isOffreActive) {
      // Désactiver le mode - vider les items offerts
      setOfferedItems(new Set())
      setIsOffreActive(false)
    } else {
      // Activer le mode (sans offrir automatiquement tous les items)
      setIsOffreActive(true)
    }
  }

  // Confirmer et envoyer vers la page devis
  const handleConfirmer = () => {
    try {
      // Préparer les lignes du devis avec les prix (offerts ou non)
      const devisLines = pricingItems.map(item => {
        const isOffered = offeredItems.has(item.id)
        const finalPrice = isOffered ? (item.offerPrice ?? 0) : item.price
        return {
          id: item.id,
          description: item.category,
          quantity: 1,
          unitPrice: finalPrice,
          total: finalPrice,
          periodicity: item.periodicity
        }
      })
      
      // Sauvegarder dans localStorage pour la page devis
      const devisData = {
        lines: devisLines,
        fromOffre: true,
        date: new Date().toISOString()
      }
      localStorage.setItem('viviworks-devis-from-offre', JSON.stringify(devisData))
      
      // Émettre un événement
      window.dispatchEvent(new Event('devis-data-updated'))
      
      // Message de succès
      toast.success("Données envoyées vers le devis !")
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur lors de l'envoi des données")
    }
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

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header avec sélecteur de durée */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF0671] focus:border-transparent bg-white"
            >
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            <span className="text-sm sm:text-lg font-bold text-gray-800">OFFRE VISIBILITÉ</span>
            <button
              onClick={toggleOffrePartenariat}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                isOffreActive 
                  ? 'bg-[#f5a623] text-white' 
                  : 'bg-[#e91e8c] text-white hover:bg-[#d11a7d]'
              }`}
            >
              {isOffreActive ? 'Annuler' : 'Offre partenariat'}
            </button>
            <button
              onClick={handleConfirmer}
              className="px-3 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#f5a623] text-white hover:bg-[#e09515] transition-all duration-300"
            >
              Confirmer
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-12 text-sm font-semibold text-gray-600">
            <span>Budget HT</span>
            <span>Périodicité</span>
          </div>
        </div>

        {/* Contenu du tableau de prix */}
        <div className="p-3 sm:p-6">
          {pricingItems.map((item) => {
            const isOffered = offeredItems.has(item.id)
            
            return (
              <div key={item.id} className="mb-4 sm:mb-6 last:mb-0">
                {/* Titre de la catégorie */}
                <h3 className="text-base sm:text-lg font-bold italic mb-2 sm:mb-3 text-[#FF0671]">
                  {item.category}
                </h3>

                {/* Item - Layout mobile vs desktop */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-3 sm:py-4 border-b border-gray-100 gap-3">
                  {/* Description */}
                  <div className="flex-1 sm:pr-8 sm:max-w-[60%]">
                    <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Prix et périodicité - Mobile: horizontal compact */}
                  <div className="flex items-center justify-end gap-4 flex-shrink-0 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:min-w-[280px]">
                    {/* Budget HT - Cliquable seulement si mode offre actif et peut être offert */}
                    <div 
                      className={`flex items-center justify-end gap-2 w-[140px] ${isOffreActive && item.canBeOffered ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={() => toggleOffer(item.id)}
                    >
                      {/* Prix original */}
                      <span className={`text-sm font-medium transition-all duration-300 text-right ${
                        isOffered ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}>
                        {item.price}€
                      </span>
                      
                      {/* Prix offre - Apparaît à côté quand offert */}
                      {isOffered && (
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs sm:text-sm"
                          style={{ backgroundColor: "#FF0671" }}
                        >
                          {item.offerPrice ?? 0}€
                        </span>
                      )}
                    </div>

                    {/* Périodicité */}
                    <div className="text-right w-[120px]">
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {item.periodicity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Navigation pages */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
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
