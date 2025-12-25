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
    isOffered: false
  },
  {
    id: "formation",
    category: "Formation",
    description: "Prendre en main l'outil de mise à jour Webtool",
    price: 95,
    periodicity: "Versement unique",
    canBeOffered: true,
    isOffered: false
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

  // Charger les prix sauvegardés depuis localStorage au montage
  useEffect(() => {
    const savedPricing = localStorage.getItem('viviworks-offre-pricing')
    if (savedPricing) {
      try {
        const pricing = JSON.parse(savedPricing)
        setPricingItems(pricing.items || defaultPricingItems)
        setSelectedDuration(pricing.duration || "60 MOIS")
      } catch (error) {
        console.error('Erreur lors du chargement des prix:', error)
      }
    }
  }, [])

  // Charger tous les devis
  useEffect(() => {
    loadAllDevis()
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

  const handleSaveAll = () => {
    const pricingData = {
      items: pricingItems,
      duration: selectedDuration
    }
    localStorage.setItem('viviworks-offre-pricing', JSON.stringify(pricingData))
    setHasChanges(false)
    toast.success("Configuration sauvegardée!")
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

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Gestion des Prix
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Configurez les prix, contenus et offres
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleResetAll} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button onClick={handleSaveAll} disabled={!hasChanges} className="bg-[#FF0671] hover:bg-[#e0055f] text-white disabled:opacity-50">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
        {hasChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-yellow-800 text-sm font-medium">⚠️ Modifications non sauvegardées</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="offre" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto gap-2">
          <TabsTrigger value="offre" className="text-sm py-3">💰 Offre de Partenariat</TabsTrigger>
          <TabsTrigger value="devis" className="text-sm py-3">📄 Gestion des Devis</TabsTrigger>
        </TabsList>

        <TabsContent value="offre" className="space-y-6">
          {/* Durée + Bouton ajouter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Card className="bg-white border border-gray-200 flex-1">
              <CardContent className="p-4 flex items-center gap-4">
                <Label className="font-medium">Durée d'engagement :</Label>
                <Select value={selectedDuration} onValueChange={(v) => { setSelectedDuration(v); setHasChanges(true) }}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un service
            </Button>
          </div>

          {/* Liste des services */}
          <div className="space-y-4">
            {pricingItems.map((item, index) => (
              <Card key={item.id} className={`bg-white border-2 transition-all ${item.isOffered ? 'border-[#FF0671] bg-pink-50/30' : 'border-gray-200'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveItem(item.id, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      {editingItem === item.id ? (
                        <Input
                          value={item.category}
                          onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                          className="text-lg font-bold text-[#FF0671] max-w-xs"
                        />
                      ) : (
                        <CardTitle className="text-lg font-bold text-[#FF0671] cursor-pointer" onClick={() => setEditingItem(item.id)}>
                          {item.category}
                        </CardTitle>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isOffered && (
                        <span className="px-3 py-1 bg-[#FF0671] text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Gift className="w-3 h-3" />OFFERT
                        </span>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}>
                        {editingItem === item.id ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                    {editingItem === item.id ? (
                      <Textarea
                        value={item.description}
                        onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                        rows={4}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 whitespace-pre-line cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => setEditingItem(item.id)}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Prix et options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Euro className="w-4 h-4" />Prix
                      </Label>
                      <div className="flex gap-2">
                        <Input type="number" value={item.price} onChange={(e) => handleFieldChange(item.id, 'price', parseFloat(e.target.value) || 0)} min="0" />
                        <span className="flex items-center px-3 bg-gray-100 rounded-md text-gray-600">€</span>
                      </div>
                    </div>

                    {item.monthlyExtra !== undefined && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Bonus mensuel</Label>
                        <div className="flex gap-2">
                          <Input type="number" value={item.monthlyExtra} onChange={(e) => handleFieldChange(item.id, 'monthlyExtra', parseFloat(e.target.value) || 0)} min="0" />
                          <span className="flex items-center px-3 bg-gray-100 rounded-md text-gray-600 text-xs">€/mois</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Périodicité</Label>
                      <Select value={item.periodicity} onValueChange={(v) => handleFieldChange(item.id, 'periodicity', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {periodicityOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Peut être offert</Label>
                        <Switch checked={item.canBeOffered} onCheckedChange={(v) => handleFieldChange(item.id, 'canBeOffered', v)} />
                      </div>
                      {item.canBeOffered && (
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#FF0671]">Offrir par défaut</Label>
                          <Switch checked={item.isOffered} onCheckedChange={(v) => handleFieldChange(item.id, 'isOffered', v)} className="data-[state=checked]:bg-[#FF0671]" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Récapitulatif */}
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">📊 Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <div className="text-sm text-gray-300 mb-1">Frais uniques</div>
                  <div className="text-2xl font-bold">{calculateOneTimeTotal()}€ HT</div>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <div className="text-sm text-gray-300 mb-1">Abonnement mensuel</div>
                  <div className="text-2xl font-bold text-[#FF0671]">{calculateMonthlyTotal()}€ HT/mois</div>
                </div>
                <div className="p-4 bg-[#FF0671]/20 rounded-lg border border-[#FF0671]">
                  <div className="text-sm text-[#FF0671] mb-1">Économies offertes</div>
                  <div className="text-2xl font-bold text-[#FF0671]">{calculateTotalSavings()}€</div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20 flex justify-between">
                <span className="text-gray-300">Engagement</span>
                <span className="font-bold text-lg">{selectedDuration}</span>
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
