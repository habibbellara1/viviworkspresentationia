"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, Loader2, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"

const conditions = [
  "Autoriser viviworks.ia à se servir du site comme référence",
  "Agir en prescripteur",
  "Vous impliquer dans la conception de votre site et garantir que les informations soient à jour",
  "Vous engager à utiliser systématiquement le site internet dans les actions de communication",
  "Adhérer à notre programme de parrainage",
]

const domainExtensions = [".fr", ".com", ".net", ".org", ".eu", ".io", ".co", ".ai", ".tech", ".dev", ".app"]

// Fonction pour extraire l'extension d'un domaine
const extractDomainParts = (input: string): { name: string; extension: string | null } => {
  const cleanInput = input.replace(/^www\./, "").trim().toLowerCase()
  
  // Chercher si une extension connue est présente
  for (const ext of domainExtensions) {
    if (cleanInput.endsWith(ext)) {
      return {
        name: cleanInput.slice(0, -ext.length),
        extension: ext
      }
    }
  }
  
  // Vérifier aussi les extensions non listées (format .xxx)
  const match = cleanInput.match(/^(.+)(\.[a-z]{2,})$/i)
  if (match) {
    return {
      name: match[1],
      extension: match[2]
    }
  }
  
  return {
    name: cleanInput,
    extension: null
  }
}

interface DomainResult {
  domain: string
  available: boolean | null
  checking: boolean
  price: number
  renewPrice: number
  error?: string
}

export function ConditionsPartenariatContent() {
  const [domainName, setDomainName] = useState("")
  const [checkedConditions, setCheckedConditions] = useState<Set<number>>(new Set())
  const [domainResults, setDomainResults] = useState<DomainResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const toggleCondition = (index: number) => {
    const newChecked = new Set(checkedConditions)
    if (newChecked.has(index)) {
      newChecked.delete(index)
      for (let i = index + 1; i < conditions.length; i++) {
        newChecked.delete(i)
      }
    } else {
      newChecked.add(index)
    }
    setCheckedConditions(newChecked)
  }

  const getVisibleConditions = () => {
    const visible = []
    for (let i = 0; i < conditions.length; i++) {
      if (i === 0 || checkedConditions.has(i - 1)) {
        visible.push(i)
      }
    }
    return visible
  }

  const checkDomainWithOVH = async (domain: string): Promise<DomainResult> => {
    try {
      const response = await fetch(`/api/domain-check?domain=${encodeURIComponent(domain)}`)
      if (response.ok) {
        const data = await response.json()
        return {
          domain: data.domain,
          available: data.available,
          checking: false,
          price: data.price,
          renewPrice: data.renewPrice,
        }
      }
      throw new Error("API error")
    } catch (error) {
      return {
        domain,
        available: null,
        checking: false,
        price: 0,
        renewPrice: 0,
        error: "Erreur de vérification",
      }
    }
  }

  const handleDomainSearch = async () => {
    if (!domainName.trim()) return

    const { name: cleanDomain, extension: userExtension } = extractDomainParts(domainName)

    if (!cleanDomain) return

    setIsSearching(true)
    setHasSearched(true)

    // Si l'utilisateur a spécifié une extension, ne vérifier que celle-ci
    const extensionsToCheck = userExtension ? [userExtension] : domainExtensions

    // Initialiser les résultats avec état "checking"
    const initialResults: DomainResult[] = extensionsToCheck.map((ext) => ({
      domain: cleanDomain + ext,
      available: null,
      checking: true,
      price: 0,
      renewPrice: 0,
    }))
    setDomainResults(initialResults)

    // Vérifier chaque extension via l'API OVH
    for (let i = 0; i < extensionsToCheck.length; i++) {
      const fullDomain = cleanDomain + extensionsToCheck[i]
      const result = await checkDomainWithOVH(fullDomain)

      setDomainResults((prev) =>
        prev.map((r, idx) => (idx === i ? result : r))
      )
    }

    setIsSearching(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDomainSearch()
    }
  }

  const visibleConditions = getVisibleConditions()

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Nos conditions de partenariat</h1>

        {/* Liste des conditions */}
        <div className="space-y-8 mb-16">
          {visibleConditions.map((index) => (
            <div
              key={index}
              className={`flex items-start gap-4 transition-all duration-500 ${
                checkedConditions.has(index - 1)
                  ? "opacity-100 transform translate-y-0"
                  : index === 0
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }`}
            >
              <button
                onClick={() => toggleCondition(index)}
                className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1 transition-all hover:scale-105 ${
                  checkedConditions.has(index)
                    ? "bg-[#FF0671] hover:bg-[#e0055f]"
                    : "border-2 border-gray-300 hover:border-[#FF0671] bg-white"
                }`}
              >
                {checkedConditions.has(index) && <Check className="w-4 h-4 text-white" />}
              </button>
              <p
                className="text-lg md:text-xl text-gray-800 leading-relaxed cursor-pointer"
                onClick={() => toggleCondition(index)}
              >
                {conditions[index]}
              </p>
            </div>
          ))}
        </div>

        {/* Section disponibilité du nom de domaine */}
        <div className="border-t border-gray-200 pt-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Vérifier la disponibilité de votre nom de domaine
            </h2>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-xs text-blue-700 font-medium">Propulsé par</span>
              <Image
                src="https://www.ovh.com/favicon.ico"
                alt="OVH"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-xs text-blue-700 font-bold">OVH</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6">
            <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
              <span className="text-lg text-gray-600">www.</span>
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="votre-domaine"
                  className="border-2 border-gray-300 rounded-lg focus:border-[#FF0671] bg-white text-lg px-4 py-3 w-full"
                  disabled={isSearching}
                />
              </div>
            </div>

            <Button
              onClick={handleDomainSearch}
              disabled={!domainName.trim() || isSearching}
              className="w-full md:w-auto bg-[#FF0671] hover:bg-[#e0055f] text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Recherche OVH...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Vérifier
                </>
              )}
            </Button>
          </div>

          {/* Résultats de la recherche */}
          {hasSearched && (
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Résultats pour &quot;{domainName.replace(/^www\./, "").trim().toLowerCase()}&quot;
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {domainResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 border-gray-300 bg-white transition-all ${
                      result.available && !result.checking ? "hover:shadow-md cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (result.available && !result.checking) {
                        window.open(
                          `https://www.ovh.com/fr/order/webcloud/?#/webCloud/domain/select?selection=${encodeURIComponent(result.domain)}`,
                          "_blank"
                        )
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{result.domain}</span>
                      {result.checking ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : result.error ? (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      ) : result.available ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="mt-2">
                      <p
                        className={`text-sm font-medium ${
                          result.checking
                            ? "text-gray-500"
                            : result.error
                            ? "text-orange-600"
                            : result.available
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.checking
                          ? "Vérification..."
                          : result.error
                          ? result.error
                          : result.available
                          ? "Disponible"
                          : "Non disponible"}
                      </p>
                    </div>
                    {!result.checking && result.available && !result.error && (
                      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Disponible à l'achat</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message d'information OVH */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Image
                  src="https://www.ovh.com/favicon.ico"
                  alt="OVH"
                  width={20}
                  height={20}
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Tarifs OVH</p>
                  <p>
                    Les prix affichés sont les tarifs OVH en vigueur (HT). Cliquez sur un domaine disponible
                    pour le commander directement sur OVH, ou contactez-nous pour que nous nous occupions
                    de l&apos;enregistrement pour vous.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Résumé des conditions cochées */}
        {checkedConditions.size > 0 && (
          <div className="mt-8 p-4 bg-pink-50 border-l-4 border-[#FF0671] rounded-r-lg">
            <p className="text-[#FF0671] font-medium">
              {checkedConditions.size} condition{checkedConditions.size > 1 ? "s" : ""} acceptée
              {checkedConditions.size > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Indicateur de progression */}
        {checkedConditions.size < conditions.length && (
          <div className="mt-6 p-4 bg-gray-100 border-l-4 border-gray-400 rounded-r-lg">
            <p className="text-gray-600 text-sm">
              Cochez la condition actuelle pour débloquer la suivante
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
