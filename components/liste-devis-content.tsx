"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Euro,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  RefreshCcw
} from "lucide-react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface DevisData {
  id: string
  numero: string
  date: string
  validite: string
  clientNom: string
  clientEmail: string
  totalHT: number
  status: 'draft' | 'sent' | 'signed' | 'paid' | 'cancelled'
  createdAt: string
  updatedAt: string
  signature?: string
  discount?: {
    label: string
    value: number
  }
}

export function ListeDevisContent() {
  const [devisList, setDevisList] = useState<DevisData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDevis, setSelectedDevis] = useState<DevisData | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Charger tous les devis depuis MongoDB Atlas
  const loadDevis = async () => {
    setIsLoading(true)
    try {
      const API_ENDPOINT = '/api/devis-mongodb'
      
      const response = await fetch(API_ENDPOINT)
      const data = await response.json()

      if (response.ok) {
        setDevisList(data.devis || [])
      } else {
        throw new Error(data.error || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devis:', error)
      toast.error("Erreur de chargement", {
        description: "Impossible de charger les devis. Vérifiez votre connexion.",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les devis au montage
  useEffect(() => {
    loadDevis()
  }, [])

  // Supprimer un devis depuis MongoDB Atlas
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      return
    }

    try {
      const API_ENDPOINT = '/api/devis-mongodb'
      
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Devis supprimé!", {
          description: "Le devis a été supprimé de la base de données.",
          duration: 3000,
        })
        // Recharger la liste
        loadDevis()
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error("Erreur de suppression", {
        description: "Impossible de supprimer le devis.",
        duration: 3000,
      })
    }
  }

  // Voir les détails d'un devis
  const handleViewDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/devis/${id}`)
      const data = await response.json()

      if (response.ok) {
        setSelectedDevis(data.devis)
        setShowDetails(true)
      } else {
        throw new Error(data.error || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Erreur lors du chargement du devis:', error)
      toast.error("Erreur", {
        description: "Impossible de charger les détails du devis.",
        duration: 3000,
      })
    }
  }

  // Filtrer les devis
  const filteredDevis = devisList.filter(devis => {
    // Filtre par recherche
    const matchSearch = 
      devis.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre par statut
    const matchStatus = statusFilter === "all" || devis.status === statusFilter

    return matchSearch && matchStatus
  })

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Brouillon</Badge>
      case 'sent':
        return <Badge variant="default" className="gap-1 bg-blue-600"><Send className="w-3 h-3" /> Envoyé</Badge>
      case 'signed':
        return <Badge variant="default" className="gap-1 bg-purple-600"><CheckCircle className="w-3 h-3" /> Signé</Badge>
      case 'paid':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="w-3 h-3" /> Payé</Badge>
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Annulé</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-8">
      {/* En-tête */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Liste des Devis
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Gérez tous vos devis enregistrés dans Upstash
            </p>
          </div>
          <Button
            onClick={loadDevis}
            className="bg-[#4fafc4] hover:bg-[#3d8a9c] text-white font-semibold"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par numéro, client ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                    <SelectItem value="signed">Signé</SelectItem>
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total devis</p>
                <p className="text-2xl font-bold text-slate-900">{devisList.length}</p>
              </div>
              <FileText className="w-8 h-8 text-[#4fafc4]" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Signés</p>
                <p className="text-2xl font-bold text-purple-600">
                  {devisList.filter(d => d.status === 'signed' || d.status === 'paid').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payés</p>
                <p className="text-2xl font-bold text-green-600">
                  {devisList.filter(d => d.status === 'paid').length}
                </p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="text-2xl font-bold text-[#804d3b]">
                  {devisList.reduce((sum, d) => sum + (d.totalHT || 0), 0).toFixed(2)} €
                </p>
              </div>
              <Euro className="w-8 h-8 text-[#804d3b]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des devis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#804d3b]" />
            {filteredDevis.length} devis trouvé{filteredDevis.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#4fafc4] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Chargement des devis...</p>
            </div>
          ) : filteredDevis.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Aucun devis trouvé</p>
              <p className="text-gray-500 text-sm">
                {searchTerm || statusFilter !== "all" 
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Créez votre premier devis pour commencer"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Devis</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Montant HT</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevis.map((devis) => (
                    <TableRow key={devis.id}>
                      <TableCell className="font-medium">{devis.numero}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{devis.clientNom}</span>
                          <span className="text-xs text-gray-500">{devis.clientEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(devis.date).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[#4fafc4]">
                        {(devis.totalHT || 0).toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(devis.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(devis.id)}
                            className="text-[#4fafc4] hover:text-[#3d8a9c] hover:bg-[#4fafc4]/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(devis.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du Devis {selectedDevis?.numero}</DialogTitle>
            <DialogDescription>
              Informations complètes du devis
            </DialogDescription>
          </DialogHeader>
          
          {selectedDevis && (
            <div className="space-y-6">
              {/* Informations client */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#804d3b]" />
                  Informations client
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom :</span>
                    <span className="font-medium">{selectedDevis.clientNom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email :</span>
                    <span className="font-medium">{selectedDevis.clientEmail}</span>
                  </div>
                </div>
              </div>

              {/* Informations devis */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#804d3b]" />
                  Informations devis
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro :</span>
                    <span className="font-medium">{selectedDevis.numero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">
                      {new Date(selectedDevis.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Validité :</span>
                    <span className="font-medium">
                      {new Date(selectedDevis.validite).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut :</span>
                    <span>{getStatusBadge(selectedDevis.status)}</span>
                  </div>
                  {selectedDevis.discount && selectedDevis.discount.value > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remise :</span>
                      <span className="font-medium text-green-600">
                        {selectedDevis.discount.label}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-gray-900 font-semibold">Total HT :</span>
                    <span className="font-bold text-lg text-[#4fafc4]">
                      {(selectedDevis.totalHT || 0).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              {selectedDevis.signature && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Signature
                  </h3>
                  <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                    <img 
                      src={selectedDevis.signature} 
                      alt="Signature" 
                      className="max-w-full h-auto border border-gray-300 rounded bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
                <div>Créé le : {new Date(selectedDevis.createdAt).toLocaleString('fr-FR')}</div>
                <div>Modifié le : {new Date(selectedDevis.updatedAt).toLocaleString('fr-FR')}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


