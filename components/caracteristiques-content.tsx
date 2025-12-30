"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Check } from "lucide-react"

const defaultOptionsDisponibles = [
  { id: "logo", label: "Création du logo", price: 500 },
  { id: "agenda", label: "Agenda en ligne", price: 300 },
  { id: "crm", label: "CRM", price: 800 },
  { id: "visio", label: "RDV visioconférence", price: 200 },
  { id: "photos", label: "Reportage photos", price: 600 },
  { id: "video", label: "Vidéo présentation", price: 1200 },
  { id: "chatbot", label: "Chatbot IA", price: 1990 },
  { id: "newsletter", label: "Newsletter", price: 400 },
  { id: "ecommerce", label: "E-commerce", price: 1500 },
  { id: "multilingue", label: "Multilingue", price: 800 },
]

const defaultOffrePersonnalisee = [
  { id: "responsive", label: "Responsive", icon: "📱" },
  { id: "seo", label: "Référencement", icon: "🔍" },
  { id: "ssl", label: "Sécurisé", icon: "🔒" },
  { id: "stats", label: "Statistiques", icon: "📊" },
  { id: "hebergement", label: "Hébergement", icon: "☁️" },
  { id: "support", label: "Support", icon: "🛠️" },
  { id: "miseajour", label: "Mises à jour", icon: "🔄" },
  { id: "formation", label: "Formation", icon: "🎓" },
]

interface OptionItem { id: string; label: string; price: number }
interface FeatureItem { id: string; label: string; icon: string }

export function CaracteristiquesContent() {
  const [optionsDisponibles, setOptionsDisponibles] = useState<OptionItem[]>(defaultOptionsDisponibles)
  const [offrePersonnalisee, setOffrePersonnalisee] = useState<FeatureItem[]>(defaultOffrePersonnalisee)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [visitesParMois] = useState(100)

  useEffect(() => {
    const savedConfig = localStorage.getItem('viviworks-caracteristiques-config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setOptionsDisponibles(config.options || defaultOptionsDisponibles)
        setOffrePersonnalisee(config.features || defaultOffrePersonnalisee)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
    const saved = localStorage.getItem('caracteristiques-options')
    if (saved) setSelectedOptions(JSON.parse(saved))
  }, [])

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelection = prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
      localStorage.setItem('caracteristiques-options', JSON.stringify(newSelection))
      return newSelection
    })
  }

  const totalOptions = selectedOptions.reduce((sum, id) => {
    const option = optionsDisponibles.find(o => o.id === id)
    return sum + (option?.price || 0)
  }, 0)

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 p-2 md:p-3">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
          
          {/* Colonne Gauche - Options */}
          <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col h-full overflow-hidden">
            <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2 flex-shrink-0">
              <span className="w-6 h-6 bg-[#FF0671] rounded-full flex items-center justify-center text-white text-xs">+</span>
              Options disponibles
            </h2>
            
            <div className="space-y-1 flex-1 overflow-y-auto">
              {optionsDisponibles.map((option) => {
                const isSelected = selectedOptions.includes(option.id)
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all text-xs ${
                      isSelected ? 'border-[#FF0671] bg-pink-50' : 'border-gray-200 hover:border-[#FF0671]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-[#FF0671] border-[#FF0671] text-white' : 'border-gray-300'
                      }`}>
                        {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-2 h-2 text-gray-400" />}
                      </div>
                      <span className={isSelected ? 'text-[#FF0671]' : 'text-gray-700'}>{option.label}</span>
                    </div>
                    <span className={`font-bold ${isSelected ? 'text-[#FF0671]' : 'text-gray-500'}`}>+{option.price}€</span>
                  </button>
                )
              })}
            </div>

            {selectedOptions.length > 0 && (
              <div className="mt-2 p-2 bg-gradient-to-r from-[#FF0671] to-[#ff3d8e] rounded-lg text-white flex-shrink-0">
                <div className="text-xs opacity-90">Total options</div>
                <div className="text-lg font-bold">+{totalOptions}€</div>
              </div>
            )}
          </div>

          {/* Colonne Centre - Image */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-2 px-4 py-2 bg-gradient-to-r from-[#FF0671] to-[#ff3d8e] rounded-full shadow-lg">
              <span className="text-white font-bold text-sm">{visitesParMois} VISITES/MOIS*</span>
            </div>

            <div className="flex-1 flex items-center justify-center w-full">
              <Image
                src="/WhatsApp Image 2025-12-24 at 05.56.33.jpeg"
                alt="Caractéristiques du site"
                width={350}
                height={400}
                className="max-h-[60vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            <p className="mt-2 text-[10px] text-gray-500 text-center">*Moyenne annuelle sur 12 mois</p>
          </div>

          {/* Colonne Droite - Offre */}
          <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col h-full overflow-hidden">
            <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2 flex-shrink-0">
              <span className="w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              Mon offre personnalisée
            </h2>
            
            <div className="space-y-1 flex-1 overflow-y-auto">
              {offrePersonnalisee.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center gap-2 p-2 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
                >
                  <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white shadow-sm">
                    <span className="text-sm">{feature.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-800 flex-1">{feature.label}</span>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              ))}
            </div>

            <div className="mt-2 p-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg text-white flex-shrink-0">
              <div className="text-xs opacity-90">Inclus dans votre offre</div>
              <div className="text-sm font-bold">8 fonctionnalités</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
