"use client"

import { useState } from "react"
import { Check, Download, Building2, User, Mail, Phone, MapPin, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContractData {
  entreprise: string
  siret: string
  adresse: string
  telephone: string
  email: string
  contact: string
  nomDomaine: string
  typeSite: string
  description: string
  conditionsAcceptees: boolean[]
  urlOption: "souhaitee" | "existante"
  rdvOption: "positionne" | "pas_contact"
  date: string
  signature: string
  representantViviworks: string
}

const conditions = [
  "Autoriser viviworks.ai à se servir du site comme référence",
  "Agir en prescripteur",
  "Vous impliquer dans la conception de votre site et garantir que les informations soient à jour",
  "Vous engager à utiliser systématiquement le site internet dans les actions de communication",
  "Adhérer à notre programme de parrainage",
]

const typesSites = [
  "Site vitrine",
  "Site e-commerce", 
  "Blog/Actualités",
  "Portfolio",
  "Site institutionnel",
  "Autre"
]

export function ValidationContent() {
  const [contractData, setContractData] = useState<ContractData>({
    entreprise: "",
    siret: "",
    adresse: "",
    telephone: "",
    email: "",
    contact: "",
    nomDomaine: "",
    typeSite: "",
    description: "",
    conditionsAcceptees: new Array(conditions.length).fill(false),
    urlOption: "souhaitee",
    rdvOption: "positionne",
    date: new Date().toISOString().split('T')[0],
    signature: "",
    representantViviworks: ""
  })

  const updateField = (field: keyof ContractData, value: string | boolean[]) => {
    setContractData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCondition = (index: number) => {
    const newConditions = [...contractData.conditionsAcceptees]
    newConditions[index] = !newConditions[index]
    updateField('conditionsAcceptees', newConditions)
  }

  const allConditionsAccepted = contractData.conditionsAcceptees.every(c => c)

  const downloadContract = () => {
    const content = `
CONTRAT DE PARTENARIAT VIVIWORKS
================================

Date: ${contractData.date}

INFORMATIONS DE L'ENTREPRISE
----------------------------
Entreprise: ${contractData.entreprise}
SIRET: ${contractData.siret}
Adresse: ${contractData.adresse}
Téléphone: ${contractData.telephone}
Email: ${contractData.email}
Contact: ${contractData.contact}

PROJET
------
Nom de domaine: ${contractData.nomDomaine}
Type de site: ${contractData.typeSite}
Description: ${contractData.description}

CONDITIONS ACCEPTÉES
--------------------
${conditions.map((c, i) => `[${contractData.conditionsAcceptees[i] ? 'X' : ' '}] ${c}`).join('\n')}

OPTIONS
-------
URL: ${contractData.urlOption === 'souhaitee' ? 'Nouvelle URL souhaitée' : 'URL existante'}
RDV: ${contractData.rdvOption === 'positionne' ? 'RDV positionné' : 'Pas de contact souhaité'}

SIGNATURES
----------
Pour l'entreprise: ${contractData.contact}
Pour Viviworks: ${contractData.representantViviworks}
    `
    
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contrat-${contractData.entreprise || 'viviworks'}-${contractData.date}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 gap-3">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#FF0671]" />
            <span className="text-lg font-bold text-gray-800">CONTRAT DE PARTENARIAT</span>
          </div>
          <Button
            onClick={downloadContract}
            disabled={!allConditionsAccepted}
            className="bg-[#FF0671] hover:bg-[#e0055f] text-white disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>

        <div className="p-3 sm:p-6 space-y-6">
          {/* Section 1: Informations entreprise */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informations de l'entreprise
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise *</label>
                <Input
                  value={contractData.entreprise}
                  onChange={(e) => updateField('entreprise', e.target.value)}
                  placeholder="Votre entreprise"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                <Input
                  value={contractData.siret}
                  onChange={(e) => updateField('siret', e.target.value)}
                  placeholder="12345678901234"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Adresse
                </label>
                <Input
                  value={contractData.adresse}
                  onChange={(e) => updateField('adresse', e.target.value)}
                  placeholder="Adresse complète"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Téléphone
                </label>
                <Input
                  value={contractData.telephone}
                  onChange={(e) => updateField('telephone', e.target.value)}
                  placeholder="01 23 45 67 89"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <Input
                  value={contractData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contact@entreprise.fr"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-4 h-4" /> Contact principal
                </label>
                <Input
                  value={contractData.contact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  placeholder="Nom du contact"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Projet */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671]">
              Projet web
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de domaine souhaité</label>
                <Input
                  value={contractData.nomDomaine}
                  onChange={(e) => updateField('nomDomaine', e.target.value)}
                  placeholder="www.monsite.fr"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de site</label>
                <select
                  value={contractData.typeSite}
                  onChange={(e) => updateField('typeSite', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#FF0671] focus:ring-[#FF0671] focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {typesSites.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description du projet</label>
                <Textarea
                  value={contractData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Décrivez votre projet..."
                  rows={3}
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Conditions */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671]">
              Conditions de partenariat
            </h3>
            
            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div
                  key={index}
                  onClick={() => toggleCondition(index)}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    contractData.conditionsAcceptees[index]
                      ? 'border-[#FF0671] bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    contractData.conditionsAcceptees[index]
                      ? 'bg-[#FF0671]'
                      : 'border-2 border-gray-300'
                  }`}>
                    {contractData.conditionsAcceptees[index] && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    contractData.conditionsAcceptees[index] ? 'text-gray-800' : 'text-gray-600'
                  }`}>
                    {condition}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Options */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671]">
              Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer ${
                    contractData.urlOption === 'souhaitee' ? 'border-[#FF0671] bg-pink-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      checked={contractData.urlOption === 'souhaitee'}
                      onChange={() => updateField('urlOption', 'souhaitee')}
                      className="text-[#FF0671]"
                    />
                    <span className="text-sm">Nouvelle URL souhaitée</span>
                  </label>
                  <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer ${
                    contractData.urlOption === 'existante' ? 'border-[#FF0671] bg-pink-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      checked={contractData.urlOption === 'existante'}
                      onChange={() => updateField('urlOption', 'existante')}
                      className="text-[#FF0671]"
                    />
                    <span className="text-sm">URL existante à transférer</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rendez-vous</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer ${
                    contractData.rdvOption === 'positionne' ? 'border-[#FF0671] bg-pink-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      checked={contractData.rdvOption === 'positionne'}
                      onChange={() => updateField('rdvOption', 'positionne')}
                      className="text-[#FF0671]"
                    />
                    <span className="text-sm">RDV brief à positionner</span>
                  </label>
                  <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer ${
                    contractData.rdvOption === 'pas_contact' ? 'border-[#FF0671] bg-pink-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      checked={contractData.rdvOption === 'pas_contact'}
                      onChange={() => updateField('rdvOption', 'pas_contact')}
                      className="text-[#FF0671]"
                    />
                    <span className="text-sm">Pas de contact souhaité</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Signatures */}
          <div>
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Validation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={contractData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signature client</label>
                <Input
                  value={contractData.signature}
                  onChange={(e) => updateField('signature', e.target.value)}
                  placeholder="Nom du signataire"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Représentant Viviworks</label>
                <Input
                  value={contractData.representantViviworks}
                  onChange={(e) => updateField('representantViviworks', e.target.value)}
                  placeholder="Nom du représentant"
                  className="border-gray-300 focus:border-[#FF0671] focus:ring-[#FF0671]"
                />
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className={`mt-6 p-4 rounded-lg ${
            allConditionsAccepted 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {allConditionsAccepted ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className={`font-medium ${allConditionsAccepted ? 'text-green-700' : 'text-gray-600'}`}>
                  {allConditionsAccepted 
                    ? 'Toutes les conditions sont acceptées' 
                    : `${contractData.conditionsAcceptees.filter(c => c).length}/${conditions.length} conditions acceptées`
                  }
                </span>
              </div>
              {allConditionsAccepted && (
                <span className="px-3 py-1 bg-[#FF0671] text-white text-xs font-bold rounded-full">
                  PRÊT
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
