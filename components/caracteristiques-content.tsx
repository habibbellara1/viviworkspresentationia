"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Check } from "lucide-react"

// Options par défaut (colonne gauche)
const defaultOptionsDisponibles = [
  { id: "logo", label: "Création du logo", price: 500 },
  { id: "agenda", label: "Agenda en ligne", price: 300 },
  { id: "crm", label: "CRM", price: 800 },
  { id: "visio", label: "RDV en visioconférence", price: 200 },
  { id: "photos", label: "Reportage photos", price: 600 },
  { id: "video", label: "Vidéo de présentation", price: 1200 },
  { id: "chatbot", label: "Chatbot IA", price: 1990 },
  { id: "newsletter", label: "Newsletter automatisée", price: 400 },
  { id: "ecommerce", label: "Module e-commerce", price: 1500 },
  { id: "multilingue", label: "Site multilingue", price: 800 },
]

// Offre personnalisée par défaut (colonne droite)
const defaultOffrePersonnalisee = [
  { id: "responsive", label: "Responsive design", icon: "📱" },
  { id: "seo", label: "Référencement naturel", icon: "🔍" },
  { id: "ssl", label: "Navigation sécurisée", icon: "🔒" },
  { id: "stats", label: "Statistiques", icon: "📊" },
  { id: "hebergement", label: "Hébergement inclus", icon: "☁️" },
  { id: "support", label: "Support technique", icon: "🛠️" },
  { id: "miseajour", label: "Mises à jour illimitées", icon: "🔄" },
  { id: "formation", label: "Formation incluse", icon: "🎓" },
]

interface OptionItem {
  id: string
  label: string
  price: number
}

interface FeatureItem {
  id: string
  label: string
  icon: string
}

export function CaracteristiquesContent() {
  const [optionsDisponibles, setOptionsDisponibles] = useState<OptionItem[]>(defaultOptionsDisponibles)
  const [offrePersonnalisee, setOffrePersonnalisee] = useState<FeatureItem[]>(defaultOffrePersonnalisee)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [visitesParMois] = useState(100)

  useEffect(() => {
    // Charger la config depuis localStorage
    const savedConfig = localStorage.getItem('viviworks-caracteristiques-config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setOptionsDisponibles(config.options || defaultOptionsDisponibles)
        setOffrePersonnalisee(config.features || defaultOffrePersonnalisee)
      } catch (error) {
        console.error('Erreur lors du chargement de la config:', error)
      }
    }

    // Charger les sélections
    const saved = localStorage.getItem('caracteristiques-options')
    if (saved) {
      setSelectedOptions(JSON.parse(saved))
    }
  }, [])

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelection = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
      
      localStorage.setItem('caracteristiques-options', JSON.stringify(newSelection))
      return newSelection
    })
  }

  const totalOptions = selectedOptions.reduce((sum, id) => {
    const option = optionsDisponibles.find(o => o.id === id)
    return sum + (option?.price || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">


      {/* Main Content - 3 Columns */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne Gauche - Options disponibles */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#FF0671] rounded-full flex items-center justify-center text-white text-sm">+</span>
              Options disponibles
            </h2>
            
            <div className="space-y-3">
              {optionsDisponibles.map((option) => {
                const isSelected = selectedOptions.includes(option.id)
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-[#FF0671] bg-pink-50' 
                        : 'border-gray-200 hover:border-[#FF0671] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#FF0671] border-[#FF0671] text-white' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-3 h-3 text-gray-400" />}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-[#FF0671]' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${isSelected ? 'text-[#FF0671]' : 'text-gray-500'}`}>
                      +{option.price}€
                    </span>
                  </button>
                )
              })}
            </div>

            {selectedOptions.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-[#FF0671] to-[#ff3d8e] rounded-xl text-white">
                <div className="text-sm opacity-90">Options sélectionnées</div>
                <div className="text-2xl font-bold">+{totalOptions}€</div>
              </div>
            )}
          </div>

          {/* Colonne Centre - Device Mockups */}
          <div className="flex flex-col items-center justify-center">
            {/* Badge visites */}
            <div className="mb-6 px-6 py-3 bg-gradient-to-r from-[#FF0671] to-[#ff3d8e] rounded-full shadow-lg">
              <span className="text-white font-bold text-lg">{visitesParMois} VISITES/MOIS*</span>
            </div>

            {/* Device Mockups Container */}
            <div className="relative w-full max-w-md h-[400px]">
              {/* Laptop - Image 1.jpeg */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 z-10">
                <div className="bg-gray-800 rounded-t-lg p-2">
                  <div className="bg-white rounded overflow-hidden">
                    <Image
                      src="/1.jpeg"
                      alt="Site vitrine - Laptop"
                      width={280}
                      height={175}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="bg-gray-700 h-3 rounded-b-lg mx-8"></div>
                <div className="bg-gray-600 h-1 rounded-b mx-16"></div>
              </div>

              {/* Tablet - Image 3.jpeg */}
              <div className="absolute bottom-8 left-0 w-36 z-20">
                <div className="bg-gray-800 rounded-2xl p-2">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <Image
                      src="/3.jpeg"
                      alt="Site vitrine - Tablet"
                      width={140}
                      height={180}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Phone - Image 4.jpeg */}
              <div className="absolute bottom-0 right-4 w-24 z-30">
                <div className="bg-gray-900 rounded-3xl p-1.5">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    <Image
                      src="/4.jpeg"
                      alt="Site vitrine - Mobile"
                      width={90}
                      height={160}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              *Moyenne annuelle mensualisée sur 12 mois
            </p>
          </div>

          {/* Colonne Droite - Mon offre personnalisée */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-sm">✓</span>
              Mon offre personnalisée
            </h2>
            
            <div className="space-y-3">
              {offrePersonnalisee.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white shadow-md">
                    <span className="text-lg">{feature.icon}</span>
                  </div>
                  <span className="font-medium text-gray-800">{feature.label}</span>
                  <Check className="w-5 h-5 text-green-500 ml-auto" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl text-white">
              <div className="text-sm opacity-90">Inclus dans votre offre</div>
              <div className="text-lg font-bold">8 fonctionnalités essentielles</div>
            </div>
          </div>
        </div>

        {/* Récapitulatif en bas */}
        {selectedOptions.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif de vos options</h3>
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map(id => {
                const option = optionsDisponibles.find(o => o.id === id)
                return option ? (
                  <span 
                    key={id}
                    className="px-4 py-2 bg-pink-100 text-[#FF0671] rounded-full text-sm font-medium"
                  >
                    {option.label} (+{option.price}€)
                  </span>
                ) : null
              })}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <span className="text-gray-600">Total des options supplémentaires :</span>
              <span className="text-2xl font-bold text-[#FF0671]">{totalOptions}€</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
