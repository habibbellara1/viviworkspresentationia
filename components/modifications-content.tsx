"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RotateCcw, Check, FileText, Trash2, Eye, Calendar, User } from "lucide-react"
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

interface Package {
  id: string
  name: string
  price: number
  engagement?: string
  popular?: boolean
  type: "web" | "mobile" | "ai" | "mobile-ai"
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

// Prix par défaut
const defaultWebPackages: Package[] = [
  { id: "demarrage", name: "DÉMARRAGE DIGITAL", price: 890, engagement: "engagement 6 mois", type: "web" },
  { id: "acceleration", name: "ACCÉLÉRATION BUSINESS", price: 1690, engagement: "engagement 12 mois", popular: true, type: "web" },
  { id: "domination", name: "DOMINATION MARCHÉ", price: 2990, engagement: "engagement 12 mois", type: "web" }
]

const defaultMobilePackages: Package[] = [
  { id: "mobile", name: "APPLICATION MOBILE", price: 5000, popular: true, type: "mobile" },
  { id: "mobile-gestion", name: "GESTION D'APPLICATION", price: 300, engagement: "engagement 12 mois", type: "mobile" }
]

const defaultAiPackages: Package[] = [
  { id: "ai-starter", name: "SITE WEB IA - STARTER", price: 3990, popular: true, type: "ai" },
  { id: "ai-pro", name: "SITE WEB IA - PROFESSIONNEL", price: 5490, type: "ai" },
  { id: "ai-enterprise", name: "SITE WEB IA - ENTERPRISE", price: 8490, type: "ai" }
]

const defaultMobileAiPackages: Package[] = [
  { id: "mobile-ai-starter", name: "APP MOBILE IA - STARTER", price: 9990, popular: true, type: "mobile-ai" },
  { id: "mobile-ai-pro", name: "APP MOBILE IA - PROFESSIONNEL", price: 11990, type: "mobile-ai" },
  { id: "mobile-ai-enterprise", name: "APP MOBILE IA - ENTERPRISE", price: 14990, type: "mobile-ai" }
]

export function ModificationsContent() {
  const [webPackages, setWebPackages] = useState<Package[]>(defaultWebPackages)
  const [mobilePackages, setMobilePackages] = useState<Package[]>(defaultMobilePackages)
  const [aiPackages, setAiPackages] = useState<Package[]>(defaultAiPackages)
  const [mobileAiPackages, setMobileAiPackages] = useState<Package[]>(defaultMobileAiPackages)
  const [hasChanges, setHasChanges] = useState(false)
  
  // États pour les devis
  const [allDevis, setAllDevis] = useState<DevisInfo[]>([])
  const [devisToDelete, setDevisToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Charger les prix sauvegardés depuis localStorage au montage
  useEffect(() => {
    const savedPrices = localStorage.getItem('viviworks-package-prices')
    if (savedPrices) {
      try {
        const prices = JSON.parse(savedPrices)
        
        // Merger avec les packages par défaut pour garder toutes les propriétés
        if (prices.web) {
          const mergedWeb = defaultWebPackages.map(pkg => {
            const savedPkg = prices.web.find((p: any) => p.id === pkg.id)
            return savedPkg ? { ...pkg, price: savedPkg.price } : pkg
          })
          setWebPackages(mergedWeb)
        }
        
        if (prices.mobile) {
          const mergedMobile = defaultMobilePackages.map(pkg => {
            const savedPkg = prices.mobile.find((p: any) => p.id === pkg.id)
            return savedPkg ? { ...pkg, price: savedPkg.price } : pkg
          })
          setMobilePackages(mergedMobile)
        }
        
        if (prices.ai) {
          const mergedAi = defaultAiPackages.map(pkg => {
            const savedPkg = prices.ai.find((p: any) => p.id === pkg.id)
            return savedPkg ? { ...pkg, price: savedPkg.price } : pkg
          })
          setAiPackages(mergedAi)
        }
        
        if (prices.mobileAi) {
          const mergedMobileAi = defaultMobileAiPackages.map(pkg => {
            const savedPkg = prices.mobileAi.find((p: any) => p.id === pkg.id)
            return savedPkg ? { ...pkg, price: savedPkg.price } : pkg
          })
          setMobileAiPackages(mergedMobileAi)
        }
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
        // Trier par date de création (plus récent en premier)
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
    
    toast.success("Devis supprimé!", {
      description: "Le devis a été supprimé avec succès.",
      duration: 3000,
    })
  }

  const handleEditDevis = (devis: DevisInfo) => {
    // Charger le devis dans la page de création
    localStorage.setItem('viviworks-current-devis', JSON.stringify(devis))
    toast.success("Devis chargé!", {
      description: "Le devis a été chargé. Allez dans la page Devis pour le modifier.",
      duration: 4000,
    })
  }

  const calculateDevisTotal = (lines: DevisLine[]) => {
    const totalHT = lines.reduce((sum, line) => sum + line.total, 0)
    return totalHT
  }

  const handlePriceChange = (type: "web" | "mobile" | "ai" | "mobile-ai", packageId: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0
    setHasChanges(true)

    switch (type) {
      case "web":
        setWebPackages(webPackages.map(pkg => 
          pkg.id === packageId ? { ...pkg, price } : pkg
        ))
        break
      case "mobile":
        setMobilePackages(mobilePackages.map(pkg => 
          pkg.id === packageId ? { ...pkg, price } : pkg
        ))
        break
      case "ai":
        setAiPackages(aiPackages.map(pkg => 
          pkg.id === packageId ? { ...pkg, price } : pkg
        ))
        break
      case "mobile-ai":
        setMobileAiPackages(mobileAiPackages.map(pkg => 
          pkg.id === packageId ? { ...pkg, price } : pkg
        ))
        break
    }
  }

  const handleSaveAll = () => {
    // Sauvegarder seulement les prix (pas les features) pour économiser l'espace
    const allPrices = {
      web: webPackages.map(pkg => ({ id: pkg.id, name: pkg.name, price: pkg.price, engagement: pkg.engagement, popular: pkg.popular, type: pkg.type })),
      mobile: mobilePackages.map(pkg => ({ id: pkg.id, name: pkg.name, price: pkg.price, engagement: pkg.engagement, popular: pkg.popular, type: pkg.type })),
      ai: aiPackages.map(pkg => ({ id: pkg.id, name: pkg.name, price: pkg.price, engagement: pkg.engagement, popular: pkg.popular, type: pkg.type })),
      mobileAi: mobileAiPackages.map(pkg => ({ id: pkg.id, name: pkg.name, price: pkg.price, engagement: pkg.engagement, popular: pkg.popular, type: pkg.type }))
    }
    
    localStorage.setItem('viviworks-package-prices', JSON.stringify(allPrices))
    setHasChanges(false)
    
    toast.success("Prix sauvegardés avec succès!", {
      description: "Tous les prix des packages ont été mis à jour.",
      duration: 3000,
    })
  }

  const handleResetAll = () => {
    setWebPackages(defaultWebPackages)
    setMobilePackages(defaultMobilePackages)
    setAiPackages(defaultAiPackages)
    setMobileAiPackages(defaultMobileAiPackages)
    localStorage.removeItem('viviworks-package-prices')
    setHasChanges(false)
    
    toast.success("Prix réinitialisés!", {
      description: "Tous les prix ont été restaurés aux valeurs par défaut.",
      duration: 3000,
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Gestion des Prix
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Modifiez les prix des packages de partenariat
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleResetAll}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={!hasChanges}
              className="bg-[#4fafc4] hover:bg-[#3d8a9c] text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Sauvegarder tout
            </Button>
          </div>
        </div>
        
        {hasChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <span className="text-yellow-800 text-sm font-medium">
              ⚠️ Vous avez des modifications non sauvegardées
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="web" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto gap-2">
          <TabsTrigger value="web" className="text-xs sm:text-sm py-2">
            🌐 Site Web
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-xs sm:text-sm py-2">
            📱 App Mobile
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs sm:text-sm py-2">
            🤖 Site Web IA
          </TabsTrigger>
          <TabsTrigger value="mobile-ai" className="text-xs sm:text-sm py-2">
            📱🤖 App Mobile IA
          </TabsTrigger>
          <TabsTrigger value="devis" className="text-xs sm:text-sm py-2">
            📄 Devis
          </TabsTrigger>
        </TabsList>

        {/* Packages Site Web */}
        <TabsContent value="web" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {webPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#804d3b] flex items-center justify-between">
                    <span>{pkg.name}</span>
                    {pkg.popular && (
                      <span className="text-xs bg-[#4fafc4] text-white px-2 py-1 rounded">
                        POPULAIRE
                      </span>
                    )}
                  </CardTitle>
                  {pkg.engagement && (
                    <p className="text-xs text-gray-600">{pkg.engagement}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`web-${pkg.id}`} className="text-sm font-medium text-gray-700">
                      Prix (€/mois)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`web-${pkg.id}`}
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePriceChange("web", pkg.id, e.target.value)}
                        className="text-lg font-semibold"
                        min="0"
                        step="10"
                      />
                      <div className="flex items-center justify-center px-3 bg-gray-100 rounded-md">
                        <span className="text-gray-600 font-medium">€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Packages Application Mobile */}
        <TabsContent value="mobile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mobilePackages.map((pkg) => (
              <Card key={pkg.id} className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#804d3b] flex items-center justify-between">
                    <span>{pkg.name}</span>
                    {pkg.popular && (
                      <span className="text-xs bg-[#4fafc4] text-white px-2 py-1 rounded">
                        POPULAIRE
                      </span>
                    )}
                  </CardTitle>
                  {pkg.engagement && (
                    <p className="text-xs text-gray-600">{pkg.engagement}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`mobile-${pkg.id}`} className="text-sm font-medium text-gray-700">
                      Prix (€{pkg.id === "mobile-gestion" ? "/mois" : ""})
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`mobile-${pkg.id}`}
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePriceChange("mobile", pkg.id, e.target.value)}
                        className="text-lg font-semibold"
                        min="0"
                        step="10"
                      />
                      <div className="flex items-center justify-center px-3 bg-gray-100 rounded-md">
                        <span className="text-gray-600 font-medium">€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Packages Site Web IA */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#804d3b] flex items-center justify-between">
                    <span>{pkg.name}</span>
                    {pkg.popular && (
                      <span className="text-xs bg-[#4fafc4] text-white px-2 py-1 rounded">
                        POPULAIRE
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`ai-${pkg.id}`} className="text-sm font-medium text-gray-700">
                      Prix de base (€)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`ai-${pkg.id}`}
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePriceChange("ai", pkg.id, e.target.value)}
                        className="text-lg font-semibold"
                        min="0"
                        step="10"
                      />
                      <div className="flex items-center justify-center px-3 bg-gray-100 rounded-md">
                        <span className="text-gray-600 font-medium">€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Packages Application Mobile IA */}
        <TabsContent value="mobile-ai" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mobileAiPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#804d3b] flex items-center justify-between">
                    <span className="text-sm sm:text-base">{pkg.name}</span>
                    {pkg.popular && (
                      <span className="text-xs bg-[#4fafc4] text-white px-2 py-1 rounded">
                        POPULAIRE
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`mobile-ai-${pkg.id}`} className="text-sm font-medium text-gray-700">
                      Prix de base (€)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`mobile-ai-${pkg.id}`}
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePriceChange("mobile-ai", pkg.id, e.target.value)}
                        className="text-lg font-semibold"
                        min="0"
                        step="10"
                      />
                      <div className="flex items-center justify-center px-3 bg-gray-100 rounded-md">
                        <span className="text-gray-600 font-medium">€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Gestion des Devis */}
        <TabsContent value="devis" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tous les devis ({allDevis.length})
            </h3>
            <p className="text-sm text-gray-600">
              Gérez tous les devis enregistrés. Vous pouvez les modifier ou les supprimer.
            </p>
          </div>

          {allDevis.length === 0 ? (
            <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Aucun devis enregistré
                  </h3>
                  <p className="text-sm text-gray-500">
                    Les devis que vous créerez dans la page "Devis" apparaîtront ici.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {allDevis.map((devis) => (
                <Card key={devis.numero} className="bg-white border border-gray-200 hover:border-[#4fafc4] transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Informations du devis */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-[#804d3b]">
                                Devis {devis.numero}
                              </h4>
                              <span className="px-3 py-1 bg-[#4fafc4] text-white text-xs font-semibold rounded-full">
                                {devis.lines.length} ligne{devis.lines.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{devis.clientNom || "Client non spécifié"}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#4fafc4]">
                              {calculateDevisTotal(devis.lines).toFixed(2)} €
                            </div>
                            <div className="text-xs text-gray-500">TTC</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Date</div>
                            <div className="text-sm font-medium text-gray-800">
                              {new Date(devis.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Validité</div>
                            <div className="text-sm font-medium text-gray-800">
                              {new Date(devis.validite).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Créé le</div>
                            <div className="text-sm font-medium text-gray-800">
                              {devis.createdAt ? new Date(devis.createdAt).toLocaleDateString('fr-FR') : '-'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Modifié le</div>
                            <div className="text-sm font-medium text-gray-800">
                              {devis.updatedAt ? new Date(devis.updatedAt).toLocaleDateString('fr-FR') : '-'}
                            </div>
                          </div>
                        </div>

                        {devis.clientAdresse && (
                          <div className="pt-2">
                            <div className="text-xs text-gray-500 mb-1">Adresse client</div>
                            <div className="text-sm text-gray-700">
                              {devis.clientAdresse}, {devis.clientCodePostal} {devis.clientVille}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <Button
                          onClick={() => handleEditDevis(devis)}
                          className="flex-1 lg:flex-none bg-[#4fafc4] hover:bg-[#3d8a9c] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          onClick={() => handleDeleteDevis(devis.numero)}
                          variant="outline"
                          className="flex-1 lg:flex-none border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
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

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDevis}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Carte de confirmation en bas */}
      {hasChanges && (
        <Card className="mt-8 bg-gradient-to-r from-[#4fafc4] to-[#3d8a9c] text-white">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Modifications en attente</h3>
                  <p className="text-sm text-white/90">
                    N'oubliez pas de sauvegarder vos modifications
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSaveAll}
                className="bg-white text-[#4fafc4] hover:bg-gray-100 font-bold px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


