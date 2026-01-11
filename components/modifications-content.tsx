"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RotateCcw, Check, Gift, Euro, FileText, Trash2, Eye, User, Plus, GripVertical, X } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

interface OptionItem {
  id: string
  label: string
  price?: number
}

interface FeatureItem {
  id: string
  label: string
  icon: string
}

interface DevisLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface DevisInfo {
  numero: string
  date: string
  validite: string
  clientNom: string
  clientAdresse: string
  clientCodePostal: string
  clientVille: string
  clientTelephone: string
  clientEmail: string
  lines: DevisLine[]
  notes: string
  createdAt?: string
  updatedAt?: string
}

// Prix par défaut de l'offre de partenariat
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

const periodicityOptions = ["Versement unique", "Mensuel", "Annuel", "Trimestriel"]
const durations = ["12 MOIS", "24 MOIS", "36 MOIS", "48 MOIS", "60 MOIS"]

// Options par défaut de la page Caractéristiques
const defaultOptionsDisponibles: OptionItem[] = [
  { id: "logo", label: "Création du logo", price: 350 },
  { id: "agenda", label: "Agenda en ligne", price: 150 },
  { id: "crm", label: "CRM", price: 200 },
  { id: "visio", label: "RDV en visioconférence", price: 100 },
  { id: "photos", label: "Reportage photos", price: 250 },
  { id: "video", label: "Vidéo de présentation", price: 400 },
  { id: "chatbot", label: "Chatbot IA", price: 300 },
  { id: "newsletter", label: "Newsletter automatisée", price: 150 },
  { id: "ecommerce", label: "Module e-commerce", price: 500 },
  { id: "multilingue", label: "Site multilingue", price: 200 },
]

const defaultOffrePersonnalisee: FeatureItem[] = [
  { id: "responsive", label: "Responsive design", icon: "📱" },
  { id: "seo", label: "Référencement naturel", icon: "🔍" },
  { id: "ssl", label: "Navigation sécurisée", icon: "🔒" },
  { id: "stats", label: "Statistiques", icon: "📊" },
  { id: "hebergement", label: "Hébergement inclus", icon: "☁️" },
  { id: "support", label: "Support technique", icon: "🛠️" },
  { id: "miseajour", label: "Mises à jour illimitées", icon: "🔄" },
  { id: "formation", label: "Formation incluse", icon: "🎓" },
]

const iconOptions = ["📱", "🔍", "🔒", "📊", "☁️", "🛠️", "🔄", "🎓", "💡", "🚀", "⭐", "✨", "🎯", "💼", "📧", "🌐", "🔔", "📈", "🎨", "🤖"]

export function ModificationsContent() {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>(defaultPricingItems)
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState("60 MOIS")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [showDeleteItemDialog, setShowDeleteItemDialog] = useState(false)
  
  // États pour les devis
  const [allDevis, setAllDevis] = useState<DevisInfo[]>([])
  const [devisToDelete, setDevisToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // États pour les options Caractéristiques
  const [optionsDisponibles, setOptionsDisponibles] = useState<OptionItem[]>(defaultOptionsDisponibles)
  const [offrePersonnalisee, setOffrePersonnalisee] = useState<FeatureItem[]>(defaultOffrePersonnalisee)
  const [editingOption, setEditingOption] = useState<string | null>(null)
  const [editingFeature, setEditingFeature] = useState<string | null>(null)
  const [optionToDelete, setOptionToDelete] = useState<string | null>(null)
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null)
  const [showDeleteOptionDialog, setShowDeleteOptionDialog] = useState(false)
  const [showDeleteFeatureDialog, setShowDeleteFeatureDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les prix depuis l'API (serveur) puis localStorage (fallback)
  useEffect(() => {
    const loadPricingConfig = async () => {
      setIsLoading(true)
      try {
        // Essayer de charger depuis l'API (serveur) - forcer no-cache
        const response = await fetch('/api/pricing-config', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (response.ok) {
          const serverConfig = await response.json()
          if (serverConfig && serverConfig.items) {
            setPricingItems(serverConfig.items)
            setSelectedDuration(serverConfig.duration || "60 MOIS")
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.error('Erreur API:', error)
      }
      
      // Fallback: utiliser les valeurs par défaut
      setPricingItems(defaultPricingItems)
      setIsLoading(false)
    }
    
    loadPricingConfig()
  }, [])

  // Charger tous les devis
  useEffect(() => {
    loadAllDevis()
  }, [])

  // Charger les options Caractéristiques depuis l'API
  useEffect(() => {
    const loadCaracteristiquesConfig = async () => {
      try {
        const response = await fetch('/api/caracteristiques-config', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (response.ok) {
          const serverConfig = await response.json()
          if (serverConfig) {
            setOptionsDisponibles(serverConfig.options || defaultOptionsDisponibles)
            setOffrePersonnalisee(serverConfig.features || defaultOffrePersonnalisee)
            return
          }
        }
      } catch (error) {
        console.error('Erreur API caracteristiques:', error)
      }
      
      // Fallback: utiliser les valeurs par défaut
      setOptionsDisponibles(defaultOptionsDisponibles)
      setOffrePersonnalisee(defaultOffrePersonnalisee)
    }
    
    loadCaracteristiquesConfig()
  }, [])

  const loadAllDevis = () => {
    const savedDevis = localStorage.getItem('viviworks-all-devis')
    if (savedDevis) {
      try {
        const devis = JSON.parse(savedDevis)
        devis.sort((a: DevisInfo, b: DevisInfo) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
        setAllDevis(devis)
      } catch (error) {
        console.error('Erreur lors du chargement des devis:', error)
      }
    }
  }

  const handleDeleteDevis = (numero: string) => {
    setDevisToDelete(numero)
    setShowDeleteDialog(true)
  }

  const confirmDeleteDevis = () => {
    if (!devisToDelete) return
    const updatedDevis = allDevis.filter(d => d.numero !== devisToDelete)
    localStorage.setItem('viviworks-all-devis', JSON.stringify(updatedDevis))
    setAllDevis(updatedDevis)
    setShowDeleteDialog(false)
    setDevisToDelete(null)
    toast.success("Devis supprimé!")
  }

  const handleEditDevis = (devis: DevisInfo) => {
    localStorage.setItem('viviworks-current-devis', JSON.stringify(devis))
    toast.success("Devis chargé! Allez dans la page Devis pour le modifier.")
  }

  const calculateDevisTotal = (lines: DevisLine[]) => {
    return lines.reduce((sum, line) => sum + line.total, 0)
  }

  // Fonctions de modification des items
  const handleFieldChange = (itemId: string, field: keyof PricingItem, value: any) => {
    setHasChanges(true)
    setPricingItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    )
  }

  const handleAddItem = () => {
    const newId = `item-${Date.now()}`
    const newItem: PricingItem = {
      id: newId,
      category: "Nouveau service",
      description: "Description du service",
      price: 0,
      periodicity: "Versement unique",
      canBeOffered: true,
      isOffered: false
    }
    setPricingItems([...pricingItems, newItem])
    setEditingItem(newId)
    setHasChanges(true)
    toast.success("Nouveau service ajouté!")
  }

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId)
    setShowDeleteItemDialog(true)
  }

  const confirmDeleteItem = () => {
    if (!itemToDelete) return
    setPricingItems(items => items.filter(item => item.id !== itemToDelete))
    setShowDeleteItemDialog(false)
    setItemToDelete(null)
    setHasChanges(true)
    toast.success("Service supprimé!")
  }

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    const index = pricingItems.findIndex(item => item.id === itemId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === pricingItems.length - 1) return

    const newItems = [...pricingItems]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]]
    setPricingItems(newItems)
    setHasChanges(true)
  }

  const handleSaveAll = async () => {
    const pricingData = {
      items: pricingItems,
      duration: selectedDuration
    }
    
    // Sauvegarder sur le serveur (MongoDB)
    try {
      const response = await fetch('/api/pricing-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingData)
      })
      
      if (response.ok) {
        toast.success("Configuration sauvegardée sur le serveur!")
        setHasChanges(false)
      } else {
        toast.error("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      console.error('Erreur sauvegarde serveur:', error)
      toast.error("Erreur de connexion au serveur")
    }
    
    // Émettre un événement pour notifier les autres composants
    window.dispatchEvent(new Event('offre-pricing-updated'))
  }

  const handleResetAll = () => {
    setPricingItems(defaultPricingItems)
    setSelectedDuration("60 MOIS")
    localStorage.removeItem('viviworks-offre-pricing')
    setHasChanges(false)
    toast.success("Configuration réinitialisée!")
  }

  const calculateTotalSavings = () => {
    return pricingItems.filter(item => item.isOffered).reduce((sum, item) => sum + item.price, 0)
  }

  const calculateMonthlyTotal = () => {
    const hebergement = pricingItems.find(i => i.periodicity === "Mensuel")
    return hebergement ? hebergement.price : 0
  }

  const calculateOneTimeTotal = () => {
    return pricingItems
      .filter(i => i.periodicity === "Versement unique" && !i.isOffered)
      .reduce((sum, i) => sum + i.price, 0)
  }

  // Fonctions pour les options Caractéristiques
  const handleOptionChange = (optionId: string, field: keyof OptionItem, value: any) => {
    setHasChanges(true)
    setOptionsDisponibles(options => 
      options.map(opt => opt.id === optionId ? { ...opt, [field]: value } : opt)
    )
  }

  const handleFeatureChange = (featureId: string, field: keyof FeatureItem, value: any) => {
    setHasChanges(true)
    setOffrePersonnalisee(features => 
      features.map(feat => feat.id === featureId ? { ...feat, [field]: value } : feat)
    )
  }

  const handleAddOption = () => {
    const newId = `option-${Date.now()}`
    const newOption: OptionItem = {
      id: newId,
      label: "Nouvelle option"
    }
    setOptionsDisponibles([...optionsDisponibles, newOption])
    setEditingOption(newId)
    setHasChanges(true)
    toast.success("Nouvelle option ajoutée!")
  }

  const handleAddFeature = () => {
    const newId = `feature-${Date.now()}`
    const newFeature: FeatureItem = {
      id: newId,
      label: "Nouvelle fonctionnalité",
      icon: "⭐"
    }
    setOffrePersonnalisee([...offrePersonnalisee, newFeature])
    setEditingFeature(newId)
    setHasChanges(true)
    toast.success("Nouvelle fonctionnalité ajoutée!")
  }

  const handleDeleteOption = (optionId: string) => {
    setOptionToDelete(optionId)
    setShowDeleteOptionDialog(true)
  }

  const confirmDeleteOption = () => {
    if (!optionToDelete) return
    setOptionsDisponibles(options => options.filter(opt => opt.id !== optionToDelete))
    setShowDeleteOptionDialog(false)
    setOptionToDelete(null)
    setHasChanges(true)
    toast.success("Option supprimée!")
  }

  const handleDeleteFeature = (featureId: string) => {
    setFeatureToDelete(featureId)
    setShowDeleteFeatureDialog(true)
  }

  const confirmDeleteFeature = () => {
    if (!featureToDelete) return
    setOffrePersonnalisee(features => features.filter(feat => feat.id !== featureToDelete))
    setShowDeleteFeatureDialog(false)
    setFeatureToDelete(null)
    setHasChanges(true)
    toast.success("Fonctionnalité supprimée!")
  }

  const moveOption = (optionId: string, direction: 'up' | 'down') => {
    const index = optionsDisponibles.findIndex(opt => opt.id === optionId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === optionsDisponibles.length - 1) return

    const newOptions = [...optionsDisponibles]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newOptions[index], newOptions[swapIndex]] = [newOptions[swapIndex], newOptions[index]]
    setOptionsDisponibles(newOptions)
    setHasChanges(true)
  }

  const moveFeature = (featureId: string, direction: 'up' | 'down') => {
    const index = offrePersonnalisee.findIndex(feat => feat.id === featureId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === offrePersonnalisee.length - 1) return

    const newFeatures = [...offrePersonnalisee]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newFeatures[index], newFeatures[swapIndex]] = [newFeatures[swapIndex], newFeatures[index]]
    setOffrePersonnalisee(newFeatures)
    setHasChanges(true)
  }

  const handleSaveCaracteristiques = async () => {
    const config = {
      options: optionsDisponibles,
      features: offrePersonnalisee
    }
    
    // Sauvegarder sur le serveur (MongoDB)
    try {
      const response = await fetch('/api/caracteristiques-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        toast.success("Options Caractéristiques sauvegardées sur le serveur!")
      } else {
        toast.error("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      console.error('Erreur sauvegarde serveur:', error)
      toast.error("Erreur de connexion au serveur")
    }
    
    // Émettre un événement pour notifier les autres composants
    window.dispatchEvent(new Event('caracteristiques-config-updated'))
  }

  const handleResetCaracteristiques = () => {
    setOptionsDisponibles(defaultOptionsDisponibles)
    setOffrePersonnalisee(defaultOffrePersonnalisee)
    localStorage.removeItem('viviworks-caracteristiques-config')
    setHasChanges(true)
    toast.success("Options réinitialisées!")
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Gestion des Prix
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Configurez les prix et offres
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button onClick={handleResetAll} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50 flex-1 sm:flex-none">
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Reset</span>
            </Button>
            <Button onClick={handleSaveAll} disabled={!hasChanges} size="sm" className="bg-[#FF0671] hover:bg-[#e0055f] text-white disabled:opacity-50 flex-1 sm:flex-none">
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Sauvegarder</span>
            </Button>
          </div>
        </div>
        {hasChanges && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-yellow-800 text-xs sm:text-sm font-medium">⚠️ Modifications non sauvegardées</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="offre" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto gap-1 sm:gap-2 p-1">
          <TabsTrigger value="offre" className="text-xs sm:text-sm py-2 sm:py-3 px-2">💰 Offre</TabsTrigger>
          <TabsTrigger value="caracteristiques" className="text-xs sm:text-sm py-2 sm:py-3 px-2">⚙️ Caractéristiques</TabsTrigger>
          <TabsTrigger value="devis" className="text-xs sm:text-sm py-2 sm:py-3 px-2">📄 Devis</TabsTrigger>
        </TabsList>

        <TabsContent value="offre" className="space-y-4 sm:space-y-6">
          {/* Durée + Bouton ajouter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-between">
            <Card className="bg-white border border-gray-200 w-full sm:flex-1">
              <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <Label className="font-medium text-sm">Durée :</Label>
                <Select value={selectedDuration} onValueChange={(v) => { setSelectedDuration(v); setHasChanges(true) }}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un service
            </Button>
          </div>

          {/* Liste des services */}
          <div className="space-y-3 sm:space-y-4">
            {pricingItems.map((item, index) => (
              <Card key={item.id} className={`bg-white border-2 transition-all ${item.isOffered ? 'border-[#FF0671] bg-pink-50/30' : 'border-gray-200'}`}>
                <CardHeader className="pb-2 px-3 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button onClick={() => moveItem(item.id, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 flex-shrink-0">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {editingItem === item.id ? (
                        <Input
                          value={item.category}
                          onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                          className="text-base sm:text-lg font-bold text-[#FF0671] flex-1"
                        />
                      ) : (
                        <CardTitle className="text-base sm:text-lg font-bold text-[#FF0671] cursor-pointer truncate" onClick={() => setEditingItem(item.id)}>
                          {item.category}
                        </CardTitle>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {item.isOffered && (
                        <span className="px-2 py-1 bg-[#FF0671] text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          <span className="hidden sm:inline">OFFERT</span>
                        </span>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setEditingItem(editingItem === item.id ? null : item.id)} className="h-8 w-8 p-0">
                        {editingItem === item.id ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                  {/* Description */}
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                    {editingItem === item.id ? (
                      <Textarea
                        value={item.description}
                        onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-line cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => setEditingItem(item.id)}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Prix et options */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Euro className="w-3 h-3 sm:w-4 sm:h-4" />Prix
                      </Label>
                      <div className="flex gap-1 sm:gap-2">
                        <Input type="number" value={item.price} onChange={(e) => handleFieldChange(item.id, 'price', parseFloat(e.target.value) || 0)} min="0" className="text-sm" />
                        <span className="flex items-center px-2 bg-gray-100 rounded-md text-gray-600 text-xs sm:text-sm">€</span>
                      </div>
                    </div>

                    {item.monthlyExtra !== undefined && (
                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Bonus</Label>
                        <div className="flex gap-1 sm:gap-2">
                          <Input type="number" value={item.monthlyExtra} onChange={(e) => handleFieldChange(item.id, 'monthlyExtra', parseFloat(e.target.value) || 0)} min="0" className="text-sm" />
                          <span className="flex items-center px-1 sm:px-2 bg-gray-100 rounded-md text-gray-600 text-xs">€/m</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Périodicité</Label>
                      <Select value={item.periodicity} onValueChange={(v) => handleFieldChange(item.id, 'periodicity', v)}>
                        <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {periodicityOptions.map(p => <SelectItem key={p} value={p} className="text-xs sm:text-sm">{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:space-y-3 col-span-2 sm:col-span-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Peut être offert</Label>
                        <Switch checked={item.canBeOffered} onCheckedChange={(v) => handleFieldChange(item.id, 'canBeOffered', v)} />
                      </div>
                      {item.canBeOffered && (
                        <>
                          <div className="flex items-center justify-between">
                            <Label className="text-xs sm:text-sm font-medium text-[#FF0671]">Offrir</Label>
                            <Switch checked={item.isOffered} onCheckedChange={(v) => handleFieldChange(item.id, 'isOffered', v)} className="data-[state=checked]:bg-[#FF0671]" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs sm:text-sm font-medium text-[#f5a623]">Prix offre</Label>
                            <div className="flex gap-1 sm:gap-2">
                              <Input type="number" value={item.offerPrice ?? 0} onChange={(e) => handleFieldChange(item.id, 'offerPrice', parseFloat(e.target.value) || 0)} min="0" className="text-sm" />
                              <span className="flex items-center px-2 bg-orange-100 rounded-md text-orange-600 text-xs">€</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Récapitulatif */}
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-xl font-bold">📊 Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white/10 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-300 mb-1">Frais uniques</div>
                  <div className="text-lg sm:text-2xl font-bold">{calculateOneTimeTotal()}€ HT</div>
                </div>
                <div className="p-3 sm:p-4 bg-white/10 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-300 mb-1">Mensuel</div>
                  <div className="text-lg sm:text-2xl font-bold text-[#FF0671]">{calculateMonthlyTotal()}€/mois</div>
                </div>
                <div className="p-3 sm:p-4 bg-[#FF0671]/20 rounded-lg border border-[#FF0671]">
                  <div className="text-xs sm:text-sm text-[#FF0671] mb-1">Économies</div>
                  <div className="text-lg sm:text-2xl font-bold text-[#FF0671]">{calculateTotalSavings()}€</div>
                </div>
              </div>
              <div className="pt-3 sm:pt-4 border-t border-white/20 flex justify-between text-sm sm:text-base">
                <span className="text-gray-300">Engagement</span>
                <span className="font-bold">{selectedDuration}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des Caractéristiques */}
        <TabsContent value="caracteristiques" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Options et fonctionnalités de la page Caractéristiques</h3>
              <p className="text-sm text-gray-500">Gérez les options disponibles et l'offre personnalisée</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleResetCaracteristiques} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
              <Button onClick={handleSaveCaracteristiques} className="bg-[#FF0671] hover:bg-[#e0055f] text-white">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>

          {/* Options disponibles */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#FF0671] flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Options disponibles (colonne gauche)
              </CardTitle>
              <Button onClick={handleAddOption} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {optionsDisponibles.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#FF0671] transition-all">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveOption(option.id, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  
                  {editingOption === option.id ? (
                    <>
                      <Input
                        value={option.label}
                        onChange={(e) => handleOptionChange(option.id, 'label', e.target.value)}
                        className="flex-1"
                        placeholder="Nom de l'option"
                      />
                      <Button variant="ghost" size="sm" onClick={() => setEditingOption(null)}>
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 font-medium text-gray-800 cursor-pointer hover:text-[#FF0671]" onClick={() => setEditingOption(option.id)}>
                        {option.label}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setEditingOption(option.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteOption(option.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Offre personnalisée */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-orange-500 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Offre personnalisée (colonne droite)
              </CardTitle>
              <Button onClick={handleAddFeature} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {offrePersonnalisee.map((feature, index) => (
                <div key={feature.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-400 transition-all">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveFeature(feature.id, 'up')} disabled={index === 0} className="p-1 hover:bg-orange-100 rounded disabled:opacity-30">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  
                  {editingFeature === feature.id ? (
                    <>
                      <Select value={feature.icon} onValueChange={(v) => handleFeatureChange(feature.id, 'icon', v)}>
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(icon => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={feature.label}
                        onChange={(e) => handleFeatureChange(feature.id, 'label', e.target.value)}
                        className="flex-1"
                        placeholder="Nom de la fonctionnalité"
                      />
                      <Button variant="ghost" size="sm" onClick={() => setEditingFeature(null)}>
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="flex-1 font-medium text-gray-800 cursor-pointer hover:text-orange-600" onClick={() => setEditingFeature(feature.id)}>
                        {feature.label}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setEditingFeature(feature.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteFeature(feature.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Aperçu */}
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">👁️ Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-[#FF0671]">Options disponibles ({optionsDisponibles.length})</h4>
                  <div className="space-y-2">
                    {optionsDisponibles.slice(0, 5).map(opt => (
                      <div key={opt.id} className="text-sm">
                        <span className="text-gray-300">{opt.label}</span>
                      </div>
                    ))}
                    {optionsDisponibles.length > 5 && (
                      <div className="text-xs text-gray-400">... et {optionsDisponibles.length - 5} autres</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-400">Offre personnalisée ({offrePersonnalisee.length})</h4>
                  <div className="space-y-2">
                    {offrePersonnalisee.slice(0, 5).map(feat => (
                      <div key={feat.id} className="flex items-center gap-2 text-sm">
                        <span>{feat.icon}</span>
                        <span className="text-gray-300">{feat.label}</span>
                      </div>
                    ))}
                    {offrePersonnalisee.length > 5 && (
                      <div className="text-xs text-gray-400">... et {offrePersonnalisee.length - 5} autres</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des Devis */}
        <TabsContent value="devis" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tous les devis ({allDevis.length})</h3>
          </div>

          {allDevis.length === 0 ? (
            <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun devis</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {allDevis.map((devis) => (
                <Card key={devis.numero} className="bg-white border border-gray-200 hover:border-[#FF0671] transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">Devis {devis.numero}</h4>
                          <span className="px-3 py-1 bg-[#FF0671] text-white text-xs font-semibold rounded-full">
                            {devis.lines.length} ligne{devis.lines.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{devis.clientNom || "Client non spécifié"}</span>
                        </div>
                        <div className="text-2xl font-bold text-[#FF0671] mt-2">{calculateDevisTotal(devis.lines).toFixed(2)} € HT</div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEditDevis(devis)} className="bg-[#FF0671] hover:bg-[#e0055f] text-white">
                          <Eye className="w-4 h-4 mr-2" />Modifier
                        </Button>
                        <Button onClick={() => handleDeleteDevis(devis.numero)} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-2" />Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog suppression devis */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce devis ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDevis} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog suppression service */}
      <AlertDialog open={showDeleteItemDialog} onOpenChange={setShowDeleteItemDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog suppression option */}
      <AlertDialog open={showDeleteOptionDialog} onOpenChange={setShowDeleteOptionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette option ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOption} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog suppression fonctionnalité */}
      <AlertDialog open={showDeleteFeatureDialog} onOpenChange={setShowDeleteFeatureDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette fonctionnalité ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFeature} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Barre de sauvegarde */}
      {hasChanges && (
        <Card className="mt-8 bg-gradient-to-r from-[#FF0671] to-[#e0055f] text-white">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Modifications en attente</h3>
                  <p className="text-sm text-white/90">N'oubliez pas de sauvegarder</p>
                </div>
              </div>
              <Button onClick={handleSaveAll} className="bg-white text-[#FF0671] hover:bg-gray-100 font-bold px-6">
                <Save className="w-4 h-4 mr-2" />Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
