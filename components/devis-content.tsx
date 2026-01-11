"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Trash2, 
  Download, 
  Save,
  FileText,
  Building2,
  User,
  Calendar,
  Euro,
  PenTool,
  Send,
  RotateCcw,
  Check,
  CreditCard,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

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
  signature?: string
  signedAt?: string
}

export function DevisContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [isSigned, setIsSigned] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  
  const [devisInfo, setDevisInfo] = useState<DevisInfo>({
    numero: `DV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    validite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientNom: "",
    clientAdresse: "",
    clientCodePostal: "",
    clientVille: "",
    clientTelephone: "",
    clientEmail: "",
    lines: [{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }],
    notes: "Devis valable 30 jours. Paiement à 30 jours net."
  })

  // Charger les informations client et les lignes depuis localStorage
  useEffect(() => {
    // Charger les infos client depuis entreprise-info
    const savedInfo = localStorage.getItem('entreprise-info')
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo)
        setDevisInfo(prev => ({
          ...prev,
          clientNom: info.enseigne || info.raisonSociale || info.nom || "",
          clientAdresse: info.adresse || "",
          clientCodePostal: info.codePostal || "",
          clientVille: info.ville || "",
          clientTelephone: info.telephone || "",
          clientEmail: info.email || "",
        }))
      } catch (error) {
        console.error('Erreur chargement infos client:', error)
      }
    }
    
    // Charger les lignes depuis offre partenariat
    const savedDevisData = localStorage.getItem('viviworks-devis-from-offre')
    if (savedDevisData) {
      try {
        const devisData = JSON.parse(savedDevisData)
        if (devisData.lines && devisData.lines.length > 0) {
          // Convertir les lignes de l'offre en lignes de devis
          const convertedLines: DevisLine[] = devisData.lines.map((line: { id: string; description: string; quantity: number; unitPrice: number; total: number }, index: number) => ({
            id: line.id || (index + 1).toString(),
            description: line.description || "",
            quantity: line.quantity || 1,
            unitPrice: line.unitPrice || 0,
            total: line.total || (line.quantity * line.unitPrice) || 0
          }))
          
          setDevisInfo(prev => ({
            ...prev,
            lines: convertedLines
          }))
        }
      } catch (error) {
        console.error('Erreur chargement lignes devis:', error)
      }
    }
  }, [])

  const addLine = () => {
    const newLine: DevisLine = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    setDevisInfo(prev => ({
      ...prev,
      lines: [...prev.lines, newLine]
    }))
  }

  const removeLine = (id: string) => {
    if (devisInfo.lines.length === 1) {
      toast.error("Vous devez avoir au moins une ligne")
      return
    }
    setDevisInfo(prev => ({
      ...prev,
      lines: prev.lines.filter(line => line.id !== id)
    }))
  }

  const updateLine = (id: string, field: keyof DevisLine, value: string | number) => {
    setDevisInfo(prev => ({
      ...prev,
      lines: prev.lines.map(line => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value }
          if (field === 'quantity' || field === 'unitPrice') {
            updatedLine.total = updatedLine.quantity * updatedLine.unitPrice
          }
          return updatedLine
        }
        return line
      })
    }))
  }

  const updateField = (field: keyof DevisInfo, value: string) => {
    setDevisInfo(prev => ({ ...prev, [field]: value }))
  }

  const calculateTotal = () => {
    return devisInfo.lines.reduce((sum, line) => sum + line.total, 0)
  }

  const saveDevis = () => {
    const allDevis = JSON.parse(localStorage.getItem('viviworks-all-devis') || '[]')
    const existingIndex = allDevis.findIndex((d: DevisInfo) => d.numero === devisInfo.numero)
    
    if (existingIndex >= 0) {
      allDevis[existingIndex] = { ...devisInfo, updatedAt: new Date().toISOString() }
    } else {
      allDevis.push({ ...devisInfo, createdAt: new Date().toISOString() })
    }
    
    localStorage.setItem('viviworks-all-devis', JSON.stringify(allDevis))
    toast.success("Devis sauvegardé!")
  }

  const downloadDevis = () => {
    const total = calculateTotal()
    const content = `
DEVIS N° ${devisInfo.numero}
Date: ${devisInfo.date}
Validité: ${devisInfo.validite}

CLIENT
------
${devisInfo.clientNom}
${devisInfo.clientAdresse}
${devisInfo.clientCodePostal} ${devisInfo.clientVille}
Tél: ${devisInfo.clientTelephone}
Email: ${devisInfo.clientEmail}

PRESTATIONS
-----------
${devisInfo.lines.map(line => 
  `${line.description}\nQté: ${line.quantity} x ${line.unitPrice}€ = ${line.total.toFixed(2)}€`
).join('\n\n')}

TOTAL HT: ${total.toFixed(2)}€

Notes: ${devisInfo.notes}
    `
    
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `devis-${devisInfo.numero}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Devis téléchargé!")
  }

  // Fonctions pour la signature électronique
  const initCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  useEffect(() => {
    initCanvas()
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
    
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y
    
    if ('touches' in e) {
      e.preventDefault()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
    
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    initCanvas()
    setSignature(null)
    setIsSigned(false)
  }

  const confirmSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const signatureData = canvas.toDataURL('image/png')
    setSignature(signatureData)
    setIsSigned(true)
    setDevisInfo(prev => ({
      ...prev,
      signature: signatureData,
      signedAt: new Date().toISOString()
    }))
    toast.success("Signature enregistrée!")
  }

  const sendSignedDevis = async () => {
    if (isSending) return // Empêcher les doubles clics
    
    if (!devisInfo.clientEmail) {
      toast.error("Veuillez renseigner l'email du client")
      return
    }

    setIsSending(true)
    
    try {
      const total = calculateTotal()
      
      const response = await fetch('/api/send-devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: devisInfo.clientEmail,
          devisData: {
            numero: devisInfo.numero,
            date: devisInfo.date,
            validite: devisInfo.validite,
            clientNom: devisInfo.clientNom,
            clientAdresse: devisInfo.clientAdresse,
            clientCodePostal: devisInfo.clientCodePostal,
            clientVille: devisInfo.clientVille,
            clientTelephone: devisInfo.clientTelephone,
            clientEmail: devisInfo.clientEmail,
            lines: devisInfo.lines,
            notes: devisInfo.notes,
            total
          },
          signature
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success(`Facture et CGV envoyées à ${devisInfo.clientEmail}!`)
        if (result.message && result.message.includes('erreur CGV')) {
          toast.warning("La facture a été envoyée mais il y a eu un problème avec les CGV")
        }
        saveDevis()
      } else {
        toast.error(result.error || "Erreur lors de l'envoi")
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur lors de l'envoi de la facture")
    } finally {
      setIsSending(false)
    }
  }

  const handlePayment = async () => {
    if (isProcessingPayment) return
    
    const total = calculateTotal()
    if (total <= 0) {
      toast.error("Le montant doit être supérieur à 0")
      return
    }

    setIsProcessingPayment(true)
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          clientEmail: devisInfo.clientEmail,
          clientNom: devisInfo.clientNom,
          devisNumero: devisInfo.numero,
          description: `Paiement facture ${devisInfo.numero} - ${devisInfo.clientNom}`
        })
      })
      
      const result = await response.json()
      
      if (response.ok && result.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = result.url
      } else {
        toast.error(result.error || "Erreur lors de la création du paiement")
      }
    } catch (error) {
      console.error('Erreur paiement:', error)
      toast.error("Erreur lors de la connexion au service de paiement")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 gap-3">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#FF0671]" />
            <span className="text-lg font-bold text-gray-800">DEVIS N° {devisInfo.numero}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveDevis} variant="outline" className="border-[#FF0671] text-[#FF0671] hover:bg-pink-50">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button onClick={downloadDevis} className="bg-[#FF0671] hover:bg-[#e0055f] text-white">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-6">
          {/* Section: Dates */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informations du devis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Numéro</Label>
                <Input
                  value={devisInfo.numero}
                  onChange={(e) => updateField('numero', e.target.value)}
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Date</Label>
                <Input
                  type="date"
                  value={devisInfo.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Validité</Label>
                <Input
                  type="date"
                  value={devisInfo.validite}
                  onChange={(e) => updateField('validite', e.target.value)}
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
            </div>
          </div>

          {/* Section: Client */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informations client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" /> Nom / Entreprise
                </Label>
                <Input
                  value={devisInfo.clientNom}
                  onChange={(e) => updateField('clientNom', e.target.value)}
                  placeholder="Nom du client"
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Adresse</Label>
                <Input
                  value={devisInfo.clientAdresse}
                  onChange={(e) => updateField('clientAdresse', e.target.value)}
                  placeholder="Adresse"
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Code postal</Label>
                <Input
                  value={devisInfo.clientCodePostal}
                  onChange={(e) => updateField('clientCodePostal', e.target.value)}
                  placeholder="75000"
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Ville</Label>
                <Input
                  value={devisInfo.clientVille}
                  onChange={(e) => updateField('clientVille', e.target.value)}
                  placeholder="Paris"
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                <Input
                  value={devisInfo.clientTelephone}
                  onChange={(e) => updateField('clientTelephone', e.target.value)}
                  placeholder="01 23 45 67 89"
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  value={devisInfo.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  placeholder="client@email.fr"
                  className="border-gray-300 focus:border-[#FF0671]"
                />
              </div>
            </div>
          </div>

          {/* Section: Lignes du devis */}
          <div className="border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold italic text-[#FF0671] flex items-center gap-2">
                <Euro className="w-5 h-5" />
                Prestations
              </h3>
              <Button onClick={addLine} size="sm" className="bg-[#f5a623] hover:bg-[#e09515] text-white">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-4">
              {devisInfo.lines.map((line, index) => (
                <div key={line.id} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 hover:border-[#FF0671] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">Ligne {index + 1}</span>
                    <Button
                      onClick={() => removeLine(line.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled={devisInfo.lines.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Description</Label>
                      <Textarea
                        value={line.description}
                        onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                        placeholder="Description du service"
                        rows={2}
                        className="border-gray-300 focus:border-[#FF0671]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm text-gray-600">Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="border-gray-300 focus:border-[#FF0671]"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Prix unitaire (€)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="border-gray-300 focus:border-[#FF0671]"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Total HT</Label>
                        <div className="h-10 px-3 py-2 bg-pink-50 border-2 border-[#FF0671] rounded-md flex items-center">
                          <span className="font-bold text-[#FF0671]">{line.total.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Notes */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671]">
              Notes
            </h3>
            <Textarea
              value={devisInfo.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Conditions, mentions légales..."
              rows={3}
              className="border-gray-300 focus:border-[#FF0671]"
            />
          </div>

          {/* Section: Signature électronique */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base sm:text-lg font-bold italic mb-4 text-[#FF0671] flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Signature électronique
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
              {!isSigned ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Signez dans le cadre ci-dessous pour valider le devis
                  </p>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair w-full max-w-[400px] touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center">
                    <Button
                      onClick={clearSignature}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Effacer
                    </Button>
                    <Button
                      onClick={confirmSignature}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Valider signature
                    </Button>
                    <Button
                      onClick={sendSignedDevis}
                      disabled={isSending || !devisInfo.clientEmail}
                      size="sm"
                      className="bg-[#FF0671] hover:bg-[#e0055f] text-white"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {isSending ? 'Envoi...' : 'Envoyer'}
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessingPayment || calculateTotal() <= 0}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      {isProcessingPayment ? 'Chargement...' : 'Payer'}
                    </Button>
                  </div>
                  {!devisInfo.clientEmail && (
                    <p className="text-xs text-red-500 mt-2">
                      Renseignez l'email du client pour envoyer
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-3">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Document signé</span>
                  </div>
                  {signature && (
                    <div className="mb-3">
                      <img 
                        src={signature} 
                        alt="Signature" 
                        className="max-w-[300px] mx-auto border border-gray-200 rounded-lg bg-white p-2"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mb-3">
                    Signé le {new Date().toLocaleString('fr-FR')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      onClick={clearSignature}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Nouvelle signature
                    </Button>
                    <Button
                      onClick={sendSignedDevis}
                      disabled={isSending || !devisInfo.clientEmail}
                      size="sm"
                      className="bg-[#FF0671] hover:bg-[#e0055f] text-white"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {isSending ? 'Envoi...' : 'Envoyer au client'}
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessingPayment || calculateTotal() <= 0}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        'Payer maintenant'
                      )}
                    </Button>
                  </div>
                  {!devisInfo.clientEmail && (
                    <p className="text-xs text-red-500 mt-2">
                      Veuillez renseigner l'email du client pour envoyer le devis
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs p-4 bg-gray-900 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total HT</span>
                <span className="text-2xl font-bold text-[#FF0671]">{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
