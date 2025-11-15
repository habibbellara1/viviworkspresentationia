"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Save,
  FileText,
  Calculator,
  PenTool,
  Eraser,
  GripVertical,
  Percent,
  Tag
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DevisLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Discount {
  id: string
  label: string
  value: number // pourcentage ou montant fixe
  type: 'percentage' | 'fixed'
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
  signatureDate?: string
  discount?: Discount
}

// Liste des remises prédéfinies
const DISCOUNTS: Discount[] = [
  { id: 'none', label: 'Aucune remise', value: 0, type: 'percentage' },
  { id: 'discount-5', label: '5% de remise', value: 5, type: 'percentage' },
  { id: 'discount-10', label: '10% de remise', value: 10, type: 'percentage' },
  { id: 'discount-15', label: '15% de remise', value: 15, type: 'percentage' },
  { id: 'discount-20', label: '20% de remise', value: 20, type: 'percentage' },
  { id: 'discount-25', label: '25% de remise', value: 25, type: 'percentage' },
  { id: 'discount-30', label: '30% de remise', value: 30, type: 'percentage' },
  { id: 'discount-50', label: '50% de remise', value: 50, type: 'percentage' },
]

// Composant pour une ligne draggable
interface SortableLineItemProps {
  line: DevisLine
  index: number
  updateLine: (id: string, field: keyof DevisLine, value: any) => void
  removeLine: (id: string) => void
  totalLines: number
}

function SortableLineItem({ line, index, updateLine, removeLine, totalLines }: SortableLineItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: line.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Déplacer la ligne"
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-700">Ligne {index + 1}</span>
        </div>
        <Button
          onClick={() => removeLine(line.id)}
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={totalLines === 1}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div>
        <Label htmlFor={`desc-${line.id}`}>Description</Label>
        <Textarea
          id={`desc-${line.id}`}
          value={line.description}
          onChange={(e) => updateLine(line.id, 'description', e.target.value)}
          placeholder="Description du service ou produit"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor={`qty-${line.id}`}>Quantité</Label>
          <Input
            id={`qty-${line.id}`}
            type="number"
            min="1"
            value={line.quantity}
            onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label htmlFor={`price-${line.id}`}>Prix unitaire (€)</Label>
          <Input
            id={`price-${line.id}`}
            type="number"
            min="0"
            step="0.01"
            value={line.unitPrice}
            onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>Total HT (€)</Label>
          <div className="h-10 px-3 py-2 bg-gray-100 rounded-md border border-gray-300 flex items-center">
            <span className="font-semibold text-[#4fafc4]">
              {line.total.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DevisContent() {
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
    notes: "Devis valable 30 jours. Paiement à 30 jours net. TVA non applicable, art. 293 B du CGI."
  })

  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Configuration des sensors pour le drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Gérer le drag and drop des lignes
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setDevisInfo((prev) => {
        const oldIndex = prev.lines.findIndex((line) => line.id === active.id)
        const newIndex = prev.lines.findIndex((line) => line.id === over.id)
        
        const newLines = arrayMove(prev.lines, oldIndex, newIndex)
        
        return {
          ...prev,
          lines: newLines
        }
      })
      
      toast.success('Ordre des lignes modifié')
    }
  }

  // Charger les informations client depuis localStorage
  useEffect(() => {
    const savedInfo = localStorage.getItem('entreprise-info')
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo)
        setDevisInfo(prev => ({
          ...prev,
          clientAdresse: info.adresse || "",
          clientCodePostal: info.codePostal || "",
          clientVille: info.ville || "",
          clientTelephone: info.telephone || "",
          clientEmail: info.email || "",
        }))
      } catch (error) {
        console.error('Erreur lors du chargement des infos client:', error)
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

  const updateLine = (id: string, field: keyof DevisLine, value: any) => {
    setDevisInfo(prev => ({
      ...prev,
      lines: prev.lines.map(line => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value }
          // Calculer le total automatiquement
          if (field === 'quantity' || field === 'unitPrice') {
            updatedLine.total = updatedLine.quantity * updatedLine.unitPrice
          }
          return updatedLine
        }
        return line
      })
    }))
  }

  // Fonctions pour la signature électronique
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    setIsDrawing(true)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
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
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#804d3b'  // Couleur marron Viviworks
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Sauvegarder la signature
    const signatureData = canvas.toDataURL('image/png')
    setDevisInfo(prev => ({
      ...prev,
      signature: signatureData,
      signatureDate: new Date().toISOString()
    }))
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setDevisInfo(prev => ({
      ...prev,
      signature: undefined,
      signatureDate: undefined
    }))
    
    toast.success("Signature effacée")
  }

  // Initialiser le canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Configurer le canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Restaurer la signature si elle existe
    if (devisInfo.signature) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = devisInfo.signature
    }
  }, [devisInfo.signature])

  const calculateTotals = () => {
    const subtotalHT = devisInfo.lines.reduce((sum, line) => sum + line.total, 0)
    
    let discountAmount = 0
    if (devisInfo.discount && devisInfo.discount.value > 0) {
      if (devisInfo.discount.type === 'percentage') {
        discountAmount = (subtotalHT * devisInfo.discount.value) / 100
      } else {
        discountAmount = devisInfo.discount.value
      }
    }
    
    const totalHT = subtotalHT - discountAmount
    
    return { 
      subtotalHT, 
      discountAmount, 
      totalHT,
      discountLabel: devisInfo.discount?.label || ''
    }
  }

  const generatePDFContent = async () => {
    const { subtotalHT, discountAmount, totalHT } = calculateTotals()

    // Convertir le logo en base64
    const convertLogoToBase64 = async () => {
      try {
        const response = await fetch('/logo.png')
        if (!response.ok) {
          console.warn('Logo non trouvé, utilisation sans logo')
          return null
        }
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.warn('Impossible de charger le logo:', error)
        return null
      }
    }
    
    let logoBase64 = null
    try {
      logoBase64 = await convertLogoToBase64()
    } catch (error) {
      console.warn('Génération du PDF sans logo')
    }

    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Devis ${devisInfo.numero} - Viviworks</title>
          <style>
            /* Forcer toutes les couleurs en RGB pour compatibilité html2canvas */
            * {
              color-scheme: light !important;
            }
            
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
              padding: 0;
              margin: 0; 
              line-height: 1.6; 
              color: #1a202c;
              background: #ffffff;
              font-size: 13px;
            }
            
            .page-container {
              width: 100%;
              min-height: 100vh;
              margin: 0;
              background: white;
              display: flex;
              flex-direction: column;
            }
            
            .header-banner {
              background: linear-gradient(135deg, #804d3b 0%, #6a3f2f 100%);
              padding: 30px 40px;
              position: relative;
              overflow: hidden;
            }
            
            .header-banner::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -10%;
              width: 400px;
              height: 400px;
              background: rgba(255,255,255,0.05);
              border-radius: 50%;
            }
            
            .header-banner::after {
              content: '';
              position: absolute;
              bottom: -30%;
              left: -5%;
              width: 300px;
              height: 300px;
              background: rgba(255,255,255,0.03);
              border-radius: 50%;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              z-index: 1;
            }
            
            .logo-section {
              display: flex;
              align-items: center;
              gap: 20px;
            }
            
            .logo-img {
              width: 65px;
              height: 65px;
              object-fit: contain;
              background: white;
              padding: 6px;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .logo-text {
              color: white;
            }
            
            .logo {
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.5px;
              margin-bottom: 3px;
            }
            
            .tagline {
              font-size: 12px;
              font-weight: 500;
              opacity: 0.95;
              letter-spacing: 0.3px;
            }
            
            .devis-info {
              text-align: right;
              color: white;
            }
            
            .devis-title {
              font-size: 36px;
              font-weight: 800;
              letter-spacing: -1px;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .devis-meta {
              font-size: 13px;
              line-height: 1.8;
              opacity: 0.95;
            }
            
            .devis-meta strong {
              font-weight: 600;
              opacity: 0.8;
            }
            
            .content-wrapper {
              padding: 30px 40px 40px 40px;
              flex: 1;
            }
            .parties {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              gap: 25px;
            }
            
            .partie {
              flex: 1;
              background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
              padding: 20px;
              border-radius: 10px;
              border: 2px solid #e2e8f0;
              position: relative;
              transition: all 0.3s ease;
            }
            
            .partie::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #4fafc4 0%, #3d8a9c 100%);
              border-radius: 12px 12px 0 0;
            }
            
            .partie-title {
              font-size: 12px;
              font-weight: 700;
              color: #4fafc4;
              margin-bottom: 14px;
              text-transform: uppercase;
              letter-spacing: 1.2px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .partie-title::before {
              content: '●';
              font-size: 8px;
            }
            
            .partie-info {
              font-size: 13px;
              line-height: 1.8;
              color: #2d3748;
            }
            
            .partie-info strong {
              color: #1a202c;
              font-weight: 600;
              display: block;
              font-size: 14px;
              margin-bottom: 6px;
            }
            
            .partie-info > div {
              margin-bottom: 1px;
            }
            .table-container {
              margin: 25px 0;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              border: 2px solid #e2e8f0;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
            }
            
            thead {
              background: linear-gradient(135deg, #4fafc4 0%, #3d8a9c 100%);
              color: white;
            }
            
            th {
              padding: 14px 12px;
              text-align: left;
              font-weight: 700;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            th:last-child, td:last-child {
              text-align: right;
            }
            
            tbody tr {
              border-bottom: 1px solid #e2e8f0;
              transition: all 0.2s ease;
            }
            
            tbody tr:last-child {
              border-bottom: none;
            }
            
            tbody tr:hover {
              background: #f8f9fa;
            }
            
            td {
              padding: 14px 12px;
              font-size: 13px;
              color: #2d3748;
            }
            .totals {
              margin-top: 20px;
              display: flex;
              justify-content: flex-end;
            }
            .totals-table {
              width: 400px;
              background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
              padding: 25px;
              border-radius: 10px;
              border: 2px solid #e2e8f0;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              font-size: 14px;
              color: #2d3748;
            }
            .total-row strong {
              font-weight: 600;
            }
            .total-row.subtotal {
              border-top: 1px solid #e2e8f0;
              padding-top: 14px;
              margin-top: 6px;
            }
            .total-row.final {
              background: linear-gradient(135deg, #4fafc4 0%, #3d8a9c 100%);
              margin: 14px -25px -25px -25px;
              padding: 18px 25px;
              border-radius: 0 0 8px 8px;
              font-size: 18px;
              font-weight: 700;
              color: white;
              letter-spacing: -0.5px;
            }
            .notes {
              margin-top: 25px;
              padding: 20px;
              background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
              border-left: 4px solid #f59e0b;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(245, 158, 11, 0.1);
            }
            .notes-title {
              font-weight: 700;
              color: #92400e;
              margin-bottom: 10px;
              font-size: 13px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .notes-content {
              font-size: 12px;
              color: #78350f;
              line-height: 1.6;
            }
            .footer {
              margin-top: 30px;
              padding: 25px 0 20px 0;
              border-top: 2px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .footer-info {
              font-size: 11px;
              color: #718096;
              line-height: 1.8;
            }
            .footer-info strong {
              color: #2d3748;
              font-weight: 600;
              display: block;
              margin-bottom: 3px;
            }
            .signature-box {
              text-align: center;
              width: 300px;
              padding: 20px;
              background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
              border-radius: 10px;
              border: 2px solid #4fafc4;
              box-shadow: 0 2px 10px rgba(79, 175, 196, 0.1);
            }
            .signature-label {
              font-size: 13px;
              color: #2d3748;
              margin-bottom: 5px;
              font-weight: 600;
            }
            .signature-mention {
              font-size: 10px;
              color: #4fafc4;
              margin-bottom: 10px;
              font-style: italic;
              font-weight: 500;
            }
            .signature-line {
              border-top: 2px solid #4fafc4;
              margin-top: 10px;
              padding-top: 10px;
              font-size: 11px;
              color: #718096;
              font-weight: 500;
            }
            .signature-box img {
              max-width: 100%;
              height: auto;
              border: 1px solid #e2e8f0;
              border-radius: 5px;
              background: white;
            }
            .qty-price {
              font-size: 12px;
              color: #718096;
              font-weight: 500;
            }
            .line-total {
              font-weight: 700;
              color: #4fafc4;
              font-size: 14px;
            }
            .description-text {
              font-weight: 500;
              color: #2d3748;
              line-height: 1.5;
              font-size: 13px;
            }
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .page-container {
                box-shadow: none;
                border-radius: 0;
              }
              body {
                padding: 0 !important;
                margin: 0 !important;
              }
              .header-banner {
                padding: 25px 30px;
              }
              .content-wrapper {
                padding: 20px 30px 30px 30px;
              }
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            <div class="header-banner">
              <div class="header">
                <div class="logo-section">
                  ${logoBase64 ? `<img src="${logoBase64}" alt="Viviworks Logo" class="logo-img" />` : ''}
                  <div class="logo-text">
                    <div class="logo">VIVIWORKS</div>
                    <div class="tagline">Création de sites internet et référencement web</div>
                  </div>
                </div>
                <div class="devis-info">
                  <div class="devis-title">DEVIS</div>
                  <div class="devis-meta">
                    <div><strong>N° :</strong> ${devisInfo.numero}</div>
                    <div><strong>Date :</strong> ${new Date(devisInfo.date).toLocaleDateString('fr-FR')}</div>
                    <div><strong>Validité :</strong> ${new Date(devisInfo.validite).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-wrapper">
              <div class="parties">
                <div class="partie">
                  <div class="partie-title">Émetteur</div>
                  <div class="partie-info">
                    <div><strong>VIVIWORKS</strong></div>
                    <div>24-26 Arcadia Avenue</div>
                    <div>Fin0000, Londres</div>
                    <div>Royaume-Uni, N3 2JU</div>
                    <div style="margin-top: 10px;">
                      <div>Tél : +33 7 84 78 99 10</div>
                      <div>Email : info@viviworks.fr</div>
                    </div>
                  </div>
                </div>
                <div class="partie">
                  <div class="partie-title">Client</div>
                  <div class="partie-info">
                    <div><strong>${(devisInfo.clientNom || "Nom du client").replace(/'/g, "\\'").replace(/"/g, '\\"')}</strong></div>
                    <div>${(devisInfo.clientAdresse || "Adresse").replace(/'/g, "\\'").replace(/"/g, '\\"')}</div>
                    <div>${(devisInfo.clientCodePostal || "Code postal").replace(/'/g, "\\'").replace(/"/g, '\\"')} ${(devisInfo.clientVille || "Ville").replace(/'/g, "\\'").replace(/"/g, '\\"')}</div>
                    <div style="margin-top: 10px;">
                      <div>Tél : ${(devisInfo.clientTelephone || "Téléphone").replace(/'/g, "\\'").replace(/"/g, '\\"')}</div>
                      <div>Email : ${(devisInfo.clientEmail || "Email").replace(/'/g, "\\'").replace(/"/g, '\\"')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 50%;">DESCRIPTION</th>
                      <th style="width: 15%; text-align: center;">QTÉ</th>
                      <th style="width: 20%; text-align: right;">P.U. HT</th>
                      <th style="width: 15%; text-align: right;">TOTAL HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${devisInfo.lines.map(line => `
                      <tr>
                        <td>
                          <div class="description-text">
                            ${(line.description || "Service").replace(/'/g, "\\'").replace(/"/g, '\\"')}
                          </div>
                        </td>
                        <td style="text-align: center;">
                          <span class="qty-price">${line.quantity}</span>
                        </td>
                        <td style="text-align: right;">
                          <span class="qty-price">${line.unitPrice.toFixed(2)} €</span>
                        </td>
                        <td style="text-align: right;">
                          <span class="line-total">${line.total.toFixed(2)} €</span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div class="totals">
                <div class="totals-table">
                  <div class="total-row final">
                    <span>TOTAL :</span>
                    <span>${totalHT.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              ${devisInfo.notes ? `
              <div class="notes">
                <div class="notes-title">📋 Notes et conditions</div>
                <div class="notes-content">${devisInfo.notes.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}

              <div class="footer">
                <div class="footer-info">
                  <div><strong>VIVIWORKS</strong></div>
                  <div>24-26 Arcadia Avenue, Fin0000, Londres, Royaume-Uni, N3 2JU</div>
                  <div>Tél : +33 7 84 78 99 10 | Email : info@viviworks.fr</div>
                </div>
                <div class="signature-box">
                  <div class="signature-label">Signature du client</div>
                  <div class="signature-mention">(Bon pour accord)</div>
                  ${devisInfo.signature ? `
                    <img src="${devisInfo.signature}" alt="Signature" style="width: 100%; height: 80px; object-fit: contain; margin: 10px 0;" />
                    <div class="signature-line">Signé le ${devisInfo.signatureDate ? new Date(devisInfo.signatureDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</div>
                  ` : `
                    <div class="signature-line">Date et signature</div>
                  `}
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }

  const handlePreview = async () => {
    try {
      const html = await generatePDFContent()
      setPreviewHtml(html)
      setShowPreview(true)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      toast.error("Erreur lors de la génération du PDF", {
        description: "Impossible de générer l'aperçu. Vérifiez les informations du devis.",
        duration: 3000,
      })
    }
  }

  const handleDownload = async () => {
    try {
      // Si une signature existe, générer directement le PDF final
      if (devisInfo.signature) {
        await generateDirectPDF()
        return
      }
      
      // Sinon, télécharger le HTML pour impression
      const html = await generatePDFContent()
      const blob = new Blob([html], { type: 'text/html; charset=UTF-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `devis-${devisInfo.numero}-${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success("Devis téléchargé!", {
        description: "Le fichier HTML a été téléchargé. Ouvrez-le dans un navigateur et imprimez en PDF.",
        duration: 5000,
      })
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error("Erreur lors du téléchargement", {
        description: "Impossible de télécharger le devis. Réessayez.",
        duration: 3000,
      })
    }
  }

  // Fonction pour générer directement un PDF avec la signature
  const generateDirectPDF = async () => {
    try {
      toast.info("Génération du PDF en cours...", {
        description: "Veuillez patienter quelques secondes",
        duration: 3000,
      })

      // Importer dynamiquement jsPDF et html2canvas
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      const html = await generatePDFContent()
      
      // Créer un iframe isolé pour éviter les conflits avec Tailwind CSS oklch
      const iframe = document.createElement('iframe')
      iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.top = '0'
      iframe.style.width = '210mm'
      iframe.style.height = '297mm'
      iframe.style.border = 'none'
      document.body.appendChild(iframe)

      // Écrire le HTML dans l'iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        throw new Error('Impossible d\'accéder au document iframe')
      }
      
      iframeDoc.open()
      iframeDoc.write(html)
      iframeDoc.close()

      // Attendre que tout soit chargé (images, fonts, etc.)
      await new Promise(resolve => {
        if (iframeDoc.readyState === 'complete') {
          resolve(true)
        } else {
          iframe.onload = () => resolve(true)
        }
      })
      
      // Attendre un peu plus pour les images
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Capturer le contenu de l'iframe avec html2canvas
      const iframeBody = iframeDoc.body
      if (!iframeBody) {
        throw new Error('Corps du document iframe non trouvé')
      }

      const canvas = await html2canvas(iframeBody, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // A4 width in pixels at 96 DPI
        foreignObjectRendering: false // Désactiver pour éviter les problèmes
      })

      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pageHeight = 297 // A4 height in mm
      
      let heightLeft = imgHeight
      let position = 0

      const imgData = canvas.toDataURL('image/png')

      // Ajouter la première page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Ajouter des pages supplémentaires si nécessaire
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Nettoyer l'iframe
      document.body.removeChild(iframe)

      // Télécharger le PDF
      const fileName = `devis-signe-${devisInfo.numero}-${devisInfo.clientNom || 'client'}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      toast.success("✅ PDF téléchargé avec succès!", {
        description: "Votre devis signé a été généré avec la signature en marron et le logo Viviworks.",
        duration: 6000,
      })
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      
      // Nettoyer l'iframe en cas d'erreur
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        if (iframe.style.left === '-9999px') {
          try {
            document.body.removeChild(iframe)
          } catch (e) {
            console.warn('Erreur lors du nettoyage de l\'iframe:', e)
          }
        }
      })
      
      toast.error("Erreur lors de la génération du PDF", {
        description: "Impossible de générer le PDF. Réessayez.",
        duration: 3000,
      })
    }
  }

  const generateInteractivePDF = async () => {
    const { subtotalHT, discountAmount, totalHT } = calculateTotals()
    
    // Convertir le logo en base64
    let logoBase64 = null
    try {
      const response = await fetch('/logo.png')
      if (response.ok) {
        const blob = await response.blob()
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      }
    } catch (error) {
      console.warn('Logo non disponible')
    }
    
    // Escape des caractères pour éviter les erreurs JavaScript
    const escapeHtml = (text: string) => {
      return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '<br>');
    };

    // Construire le HTML du devis
    let html = '<!DOCTYPE html>';
    html += '\n<html lang="fr">';
    html += '\n<head>';
    html += '\n  <meta charset="UTF-8">';
    html += '\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">';
    html += '\n  <title>Devis ' + devisInfo.numero + ' - À Signer</title>';
    html += '\n  <style>';
    html += '\n    * { margin: 0; padding: 0; box-sizing: border-box; }';
    html += '\n    body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; line-height: 1.6; color: #2d3748; }';
    html += '\n    .container { max-width: 900px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }';
    html += '\n    .header-banner { background: linear-gradient(135deg, #804d3b 0%, #6a3f2f 100%); padding: 30px 40px; position: relative; overflow: hidden; }';
    html += '\n    .header-banner::before { content: ""; position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; background: rgba(255,255,255,0.05); border-radius: 50%; }';
    html += '\n    .header-banner::after { content: ""; position: absolute; bottom: -30%; left: -5%; width: 300px; height: 300px; background: rgba(255,255,255,0.03); border-radius: 50%; }';
    html += '\n    .header { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }';
    html += '\n    .logo-section { display: flex; align-items: center; gap: 20px; }';
    html += '\n    .logo-img { width: 65px; height: 65px; object-fit: contain; background: white; padding: 6px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }';
    html += '\n    .logo-text { color: white; }';
    html += '\n    .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 3px; }';
    html += '\n    .tagline { font-size: 12px; font-weight: 500; opacity: 0.95; letter-spacing: 0.3px; }';
    html += '\n    .devis-info { text-align: right; color: white; }';
    html += '\n    .devis-title { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }';
    html += '\n    .devis-meta { font-size: 13px; line-height: 1.8; opacity: 0.95; }';
    html += '\n    .devis-meta strong { font-weight: 600; opacity: 0.8; }';
    html += '\n    .content-wrapper { padding: 30px 40px 40px 40px; }';
    html += '\n    .parties { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 25px; }';
    html += '\n    .partie { flex: 1; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 20px; border-radius: 10px; border: 2px solid #e2e8f0; position: relative; }';
    html += '\n    .partie::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #4fafc4 0%, #3d8a9c 100%); border-radius: 12px 12px 0 0; }';
    html += '\n    .partie-title { font-size: 12px; font-weight: 700; color: #4fafc4; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 1.2px; }';
    html += '\n    .partie-info { font-size: 13px; line-height: 1.8; color: #2d3748; }';
    html += '\n    .partie-info strong { color: #1a202c; font-weight: 600; display: block; font-size: 14px; margin-bottom: 6px; }';
    html += '\n    .table-container { margin: 25px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid #e2e8f0; }';
    html += '\n    table { width: 100%; border-collapse: collapse; }';
    html += '\n    thead { background: linear-gradient(135deg, #4fafc4 0%, #3d8a9c 100%); color: white; }';
    html += '\n    th { padding: 14px 12px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }';
    html += '\n    th:last-child, td:last-child { text-align: right; }';
    html += '\n    tbody tr { border-bottom: 1px solid #e2e8f0; }';
    html += '\n    tbody tr:last-child { border-bottom: none; }';
    html += '\n    td { padding: 14px 12px; font-size: 13px; color: #2d3748; }';
    html += '\n    .total-box { background: linear-gradient(135deg, #4fafc4 0%, #3d8a9c 100%); padding: 20px 30px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin: 25px 0; box-shadow: 0 4px 15px rgba(79, 175, 196, 0.3); }';
    html += '\n    .total-label { font-size: 20px; font-weight: 700; color: white; letter-spacing: 1px; }';
    html += '\n    .total-amount { font-size: 28px; font-weight: 900; color: white; }';
    html += '\n    .notes { margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 4px solid #f59e0b; border-radius: 8px; }';
    html += '\n    .notes-title { font-weight: 700; color: #92400e; margin-bottom: 10px; font-size: 13px; }';
    html += '\n    .notes-content { font-size: 12px; color: #78350f; line-height: 1.6; }';
    html += '\n    .signature-section { margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 15px; border: 3px solid #0284c7; text-align: center; }';
    html += '\n    .signature-section h2 { color: #075985; font-size: 26px; margin-bottom: 10px; font-weight: 700; }';
    html += '\n    .instructions-box { background: white; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: left; }';
    html += '\n    .instructions-box p { margin: 0; color: #075985; font-size: 14px; font-weight: 600; margin-bottom: 10px; }';
    html += '\n    .instructions-box ul { margin: 10px 0 0 20px; color: #0c4a6e; font-size: 13px; }';
    html += '\n    .instructions-box li { margin: 5px 0; }';
    html += '\n    #signatureCanvas { border: 4px solid #4fafc4; border-radius: 10px; cursor: crosshair; background: white; display: block; margin: 20px auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); touch-action: none; user-select: none; }';
    html += '\n    #signatureCanvas:hover { border-color: #804d3b; box-shadow: 0 6px 25px rgba(128, 77, 59, 0.3); }';
    html += '\n    .button-group { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }';
    html += '\n    button { padding: 14px 35px; font-size: 16px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }';
    html += '\n    .btn-clear { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }';
    html += '\n    .btn-clear:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4); }';
    html += '\n    .btn-download { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; }';
    html += '\n    .btn-download:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4); }';
    html += '\n    .status-message { margin-top: 20px; padding: 15px; border-radius: 8px; font-weight: 600; text-align: center; display: none; }';
    html += '\n    .status-success { background: #d1fae5; color: #065f46; border: 2px solid #10b981; }';
    html += '\n    .status-warning { background: #fef3c7; color: #92400e; border: 2px solid #f59e0b; }';
    html += '\n    .info-box { margin-top: 20px; background: #f0f9ff; padding: 15px; border-radius: 8px; border: 2px solid #38bdf8; text-align: center; font-size: 13px; color: #0c4a6e; line-height: 1.8; }';
    html += '\n    .footer { text-align: center; margin-top: 30px; padding: 25px; background: #f8f9fa; border-top: 3px solid #e2e8f0; color: #718096; font-size: 12px; }';
    html += '\n    .footer strong { color: #2d3748; display: block; margin-bottom: 5px; font-size: 14px; }';
    html += '\n    .loader { display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #4fafc4; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px; vertical-align: middle; }';
    html += '\n    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    html += '\n  </style>';
    html += '\n</head>';
    html += '\n<body>';
    html += '\n  <div class="container">';
    
    // Header avec logo
    html += '\n    <div class="header-banner">';
    html += '\n      <div class="header">';
    html += '\n        <div class="logo-section">';
    if (logoBase64) {
      html += '\n          <img src="' + logoBase64 + '" alt="Viviworks Logo" class="logo-img" />';
    }
    html += '\n          <div class="logo-text">';
    html += '\n            <div class="logo">VIVIWORKS</div>';
    html += '\n            <div class="tagline">Création de sites internet et référencement web</div>';
    html += '\n          </div>';
    html += '\n        </div>';
    html += '\n        <div class="devis-info">';
    html += '\n          <div class="devis-title">DEVIS</div>';
    html += '\n          <div class="devis-meta">';
    html += '\n            <div><strong>N° :</strong> ' + devisInfo.numero + '</div>';
    html += '\n            <div><strong>Date :</strong> ' + new Date(devisInfo.date).toLocaleDateString('fr-FR') + '</div>';
    html += '\n            <div><strong>Validité :</strong> ' + new Date(devisInfo.validite).toLocaleDateString('fr-FR') + '</div>';
    html += '\n          </div>';
    html += '\n        </div>';
    html += '\n      </div>';
    html += '\n    </div>';
    
    // Content
    html += '\n    <div class="content-wrapper">';
    html += '\n      <div class="parties">';
    html += '\n        <div class="partie">';
    html += '\n          <div class="partie-title">• ÉMETTEUR</div>';
    html += '\n          <div class="partie-info">';
    html += '\n            <strong>VIVIWORKS</strong>';
    html += '\n            <div>24-26 Arcadia Avenue</div>';
    html += '\n            <div>Fin0000, Londres</div>';
    html += '\n            <div>Royaume-Uni, N3 2JU</div>';
    html += '\n            <div style="margin-top: 10px;">Tél : +33 7 84 78 99 10</div>';
    html += '\n            <div>Email : info@viviworks.fr</div>';
    html += '\n          </div>';
    html += '\n        </div>';
    html += '\n        <div class="partie">';
    html += '\n          <div class="partie-title">• CLIENT</div>';
    html += '\n          <div class="partie-info">';
    html += '\n            <strong>' + escapeHtml(devisInfo.clientNom || 'Nom du client') + '</strong>';
    html += '\n            <div>' + escapeHtml(devisInfo.clientAdresse || '') + '</div>';
    html += '\n            <div>' + escapeHtml(devisInfo.clientCodePostal || '') + ' ' + escapeHtml(devisInfo.clientVille || '') + '</div>';
    html += '\n            <div style="margin-top: 10px;">Tél : ' + escapeHtml(devisInfo.clientTelephone || '') + '</div>';
    html += '\n            <div>Email : ' + escapeHtml(devisInfo.clientEmail || '') + '</div>';
    html += '\n          </div>';
    html += '\n        </div>';
    html += '\n      </div>';
    
    // Tableau
    html += '\n      <div class="table-container">';
    html += '\n        <table>';
    html += '\n          <thead>';
    html += '\n            <tr>';
    html += '\n              <th>DESCRIPTION</th>';
    html += '\n              <th>QTÉ</th>';
    html += '\n              <th>P.U. HT</th>';
    html += '\n              <th>TOTAL HT</th>';
    html += '\n            </tr>';
    html += '\n          </thead>';
    html += '\n          <tbody>';
    devisInfo.lines.forEach(line => {
      html += '\n            <tr>';
      html += '\n              <td>' + escapeHtml(line.description || 'Service') + '</td>';
      html += '\n              <td>' + line.quantity + '</td>';
      html += '\n              <td>' + line.unitPrice.toFixed(2) + ' €</td>';
      html += '\n              <td><strong>' + line.total.toFixed(2) + ' €</strong></td>';
      html += '\n            </tr>';
    });
    html += '\n          </tbody>';
    html += '\n        </table>';
    html += '\n      </div>';
    
    // Total
    if (devisInfo.discount && devisInfo.discount.value > 0) {
      html += '\n      <div style="margin: 25px 0; text-align: right;">';
      html += '\n        <div style="display: inline-block; min-width: 350px; text-align: left;">';
      html += '\n          <div style="display: flex; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid #e2e8f0;">';
      html += '\n            <span style="color: #2d3748; font-size: 14px;">Sous-total HT :</span>';
      html += '\n            <span style="font-weight: 600; color: #2d3748; font-size: 14px;">' + subtotalHT.toFixed(2) + ' €</span>';
      html += '\n          </div>';
      html += '\n          <div style="display: flex; justify-content: space-between; padding: 10px 20px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left: 4px solid #10b981;">';
      html += '\n            <span style="color: #065f46; font-size: 14px; font-weight: 600;">🏷️ Remise (' + devisInfo.discount.value + '%) :</span>';
      html += '\n            <span style="font-weight: 700; color: #059669; font-size: 14px;">-' + discountAmount.toFixed(2) + ' €</span>';
      html += '\n          </div>';
      html += '\n          <div style="display: flex; justify-content: space-between; padding: 20px; background: linear-gradient(135deg, #4fafc4 0%, #3d8a9c 100%); border-radius: 0 0 10px 10px;">';
      html += '\n            <span style="color: white; font-size: 18px; font-weight: 700; letter-spacing: 1px;">TOTAL HT :</span>';
      html += '\n            <span style="font-weight: 900; color: white; font-size: 24px;">' + totalHT.toFixed(2) + ' €</span>';
      html += '\n          </div>';
      html += '\n        </div>';
      html += '\n      </div>';
    } else {
      html += '\n      <div class="total-box">';
      html += '\n        <div class="total-label">TOTAL HT :</div>';
      html += '\n        <div class="total-amount">' + totalHT.toFixed(2) + ' €</div>';
      html += '\n      </div>';
    }
    
    // Notes
    if (devisInfo.notes) {
      html += '\n      <div class="notes">';
      html += '\n        <div class="notes-title">📝 Notes et conditions</div>';
      html += '\n        <div class="notes-content">' + escapeHtml(devisInfo.notes) + '</div>';
      html += '\n      </div>';
    }
    
    // Section signature
    html += '\n      <div class="signature-section">';
    html += '\n        <h2>✍️ SIGNATURE ÉLECTRONIQUE DU CLIENT</h2>';
    html += '\n        <p style="font-weight: 600; color: #0c4a6e; font-size: 15px;">Bon pour accord</p>';
    html += '\n        <div class="instructions-box">';
    html += '\n          <p>📝 <strong>Instructions pour signer :</strong></p>';
    html += '\n          <ul>';
    html += '\n            <li>Dessinez votre signature en <strong style="color: #804d3b;">MARRON</strong> dans la zone ci-dessous</li>';
    html += '\n            <li>Utilisez votre souris (PC) ou votre doigt (mobile/tablette)</li>';
    html += '\n            <li>Cliquez sur "Effacer" pour recommencer si besoin</li>';
    html += '\n            <li>Cliquez sur le bouton vert pour télécharger le PDF avec votre signature</li>';
    html += '\n          </ul>';
    html += '\n        </div>';
    html += '\n        <canvas id="signatureCanvas" width="700" height="200"></canvas>';
    html += '\n        <div class="button-group">';
    html += '\n          <button class="btn-clear" onclick="clearSignature()">🗑️ Effacer la signature</button>';
    html += '\n          <button class="btn-download" id="downloadBtn" onclick="downloadSignedPDF()">💾 Télécharger le PDF signé</button>';
    html += '\n        </div>';
    html += '\n        <div id="statusMessage" class="status-message"></div>';
    html += '\n        <div class="info-box">';
    html += '\n          <strong>💡 Ce qui va se passer :</strong><br>';
    html += '\n          1️⃣ Vous signez dans la zone blanche ci-dessus<br>';
    html += '\n          2️⃣ Vous cliquez sur le bouton vert<br>';
    html += '\n          3️⃣ Le PDF avec votre signature + le logo Viviworks se télécharge automatiquement<br>';
    html += '\n          4️⃣ Vous le retrouvez dans votre dossier <strong>Téléchargements</strong><br>';
    html += '\n          5️⃣ Vous nous le renvoyez par email à <strong>info@viviworks.fr</strong>';
    html += '\n        </div>';
    html += '\n      </div>';
    
    // Footer
    html += '\n      <div class="footer">';
    html += '\n        <strong>VIVIWORKS</strong>';
    html += '\n        24-26 Arcadia Avenue, Fin0000, Londres, Royaume-Uni, N3 2JU<br>';
    html += '\n        Tél : +33 7 84 78 99 10 | Email : info@viviworks.fr';
    html += '\n      </div>';
    html += '\n    </div>';
    html += '\n  </div>';
    
    // JavaScript
    html += '\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>';
    html += '\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>';
    html += '\n  <script>';
    html += '\n    (function() {';
    html += '\n      "use strict";';
    html += '\n      if (document.readyState === "loading") {';
    html += '\n        document.addEventListener("DOMContentLoaded", initSignature);';
    html += '\n      } else {';
    html += '\n        initSignature();';
    html += '\n      }';
    html += '\n      function initSignature() {';
    html += '\n        console.log("Initialisation...");';
    html += '\n        var canvas = document.getElementById("signatureCanvas");';
    html += '\n        if (!canvas) { alert("Erreur: Canvas introuvable"); return; }';
    html += '\n        var ctx = canvas.getContext("2d");';
    html += '\n        if (!ctx) { alert("Erreur: Contexte 2D introuvable"); return; }';
    html += '\n        var statusMessage = document.getElementById("statusMessage");';
    html += '\n        var isDrawing = false;';
    html += '\n        var hasSigned = false;';
    html += '\n        function initCanvas() {';
    html += '\n          ctx.fillStyle = "#ffffff";';
    html += '\n          ctx.fillRect(0, 0, canvas.width, canvas.height);';
    html += '\n          ctx.strokeStyle = "#e2e8f0";';
    html += '\n          ctx.lineWidth = 1;';
    html += '\n          ctx.strokeRect(0, 0, canvas.width, canvas.height);';
    html += '\n          ctx.font = "18px Arial";';
    html += '\n          ctx.fillStyle = "#cbd5e0";';
    html += '\n          ctx.textAlign = "center";';
    html += '\n          ctx.textBaseline = "middle";';
    html += '\n          ctx.fillText("✍️ Cliquez et dessinez votre signature ici", canvas.width / 2, canvas.height / 2);';
    html += '\n        }';
    html += '\n        initCanvas();';
    html += '\n        function getCoords(e) {';
    html += '\n          var rect = canvas.getBoundingClientRect();';
    html += '\n          var scaleX = canvas.width / rect.width;';
    html += '\n          var scaleY = canvas.height / rect.height;';
    html += '\n          var x, y;';
    html += '\n          if (e.type.indexOf("touch") === 0) {';
    html += '\n            if (!e.touches || e.touches.length === 0) return null;';
    html += '\n            x = (e.touches[0].clientX - rect.left) * scaleX;';
    html += '\n            y = (e.touches[0].clientY - rect.top) * scaleY;';
    html += '\n          } else {';
    html += '\n            x = (e.clientX - rect.left) * scaleX;';
    html += '\n            y = (e.clientY - rect.top) * scaleY;';
    html += '\n          }';
    html += '\n          return { x: x, y: y };';
    html += '\n        }';
    html += '\n        function startDrawing(e) {';
    html += '\n          if (e.cancelable) e.preventDefault();';
    html += '\n          var coords = getCoords(e);';
    html += '\n          if (!coords) return;';
    html += '\n          isDrawing = true;';
    html += '\n          if (!hasSigned) {';
    html += '\n            ctx.fillStyle = "#ffffff";';
    html += '\n            ctx.fillRect(0, 0, canvas.width, canvas.height);';
    html += '\n            hasSigned = true;';
    html += '\n            if (statusMessage) statusMessage.style.display = "none";';
    html += '\n          }';
    html += '\n          ctx.beginPath();';
    html += '\n          ctx.moveTo(coords.x, coords.y);';
    html += '\n        }';
    html += '\n        function draw(e) {';
    html += '\n          if (!isDrawing) return;';
    html += '\n          if (e.cancelable) e.preventDefault();';
    html += '\n          var coords = getCoords(e);';
    html += '\n          if (!coords) return;';
    html += '\n          ctx.strokeStyle = "#804d3b";';
    html += '\n          ctx.lineWidth = 3;';
    html += '\n          ctx.lineCap = "round";';
    html += '\n          ctx.lineJoin = "round";';
    html += '\n          ctx.lineTo(coords.x, coords.y);';
    html += '\n          ctx.stroke();';
    html += '\n        }';
    html += '\n        function stopDrawing(e) {';
    html += '\n          if (!isDrawing) return;';
    html += '\n          isDrawing = false;';
    html += '\n        }';
    html += '\n        window.clearSignature = function() {';
    html += '\n          initCanvas();';
    html += '\n          hasSigned = false;';
    html += '\n          if (statusMessage) statusMessage.style.display = "none";';
    html += '\n        };';
    html += '\n        window.downloadSignedPDF = function() {';
    html += '\n          if (!hasSigned) {';
    html += '\n            alert("Veuillez signer avant de télécharger !");';
    html += '\n            return;';
    html += '\n          }';
    html += '\n          if (typeof window.jspdf === "undefined" || typeof html2canvas === "undefined") {';
    html += '\n            alert("Erreur: Librairies non chargées. Rechargez la page.");';
    html += '\n            return;';
    html += '\n          }';
    html += '\n          if (statusMessage) {';
    html += '\n            statusMessage.style.display = "block";';
    html += '\n            statusMessage.className = "status-message status-success";';
    html += '\n            statusMessage.innerHTML = "Génération du PDF...";';
    html += '\n          }';
    html += '\n          var signatureData = canvas.toDataURL("image/png");';
    html += '\n          var signatureDate = new Date().toLocaleString("fr-FR");';
    html += '\n          var devisTitle = document.querySelector(".devis-title");';
    html += '\n          if (devisTitle) devisTitle.textContent = "FACTURE";';
    html += '\n          var signatureSection = document.querySelector(".signature-section");';
    html += '\n          signatureSection.innerHTML = "<div style=\\"text-align: center; padding: 30px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 10px; border: 3px solid #22c55e;\\"><h3 style=\\"color: #15803d; font-size: 18px; font-weight: 700; margin-bottom: 15px;\\">✅ FACTURE SIGNÉE</h3><div style=\\"background: white; padding: 20px; border-radius: 8px; margin: 15px auto; max-width: 400px;\\"><div style=\\"font-weight: 600; color: #2d3748; margin-bottom: 10px;\\">Signature du client</div><div style=\\"font-style: italic; color: #4fafc4; margin-bottom: 10px;\\">(Bon pour accord)</div><img src=\\"" + signatureData + "\\" style=\\"max-width: 300px; width: 100%; border: 2px solid #e2e8f0; border-radius: 8px; display: block; margin: 10px auto;\\" /><div style=\\"margin-top: 10px; font-size: 12px; color: #718096;\\">📅 Signé le " + signatureDate + "</div></div></div>";';
    html += '\n          setTimeout(function() {';
    html += '\n            html2canvas(document.querySelector(".container"), { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" }).then(function(canvasResult) {';
    html += '\n              var jsPDF = window.jspdf.jsPDF;';
    html += '\n              var imgData = canvasResult.toDataURL("image/png");';
    html += '\n              var pdf = new jsPDF("portrait", "mm", "a4");';
    html += '\n              var imgWidth = 210;';
    html += '\n              var pageHeight = 297;';
    html += '\n              var imgHeight = (canvasResult.height * imgWidth) / canvasResult.width;';
    html += '\n              var heightLeft = imgHeight;';
    html += '\n              var position = 0;';
    html += '\n              pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);';
    html += '\n              heightLeft -= pageHeight;';
    html += '\n              while (heightLeft > 0) {';
    html += '\n                position = heightLeft - imgHeight;';
    html += '\n                pdf.addPage();';
    html += '\n                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);';
    html += '\n                heightLeft -= pageHeight;';
    html += '\n              }';
    html += '\n              var timestamp = new Date().toISOString().split("T")[0];';
    html += '\n              var fileName = "facture-signee-" + timestamp + ".pdf";';
    html += '\n              pdf.save(fileName);';
    html += '\n              if (statusMessage) {';
    html += '\n                statusMessage.innerHTML = "✅ PDF téléchargé avec succès !";';
    html += '\n              }';
    html += '\n            }).catch(function(error) {';
    html += '\n              alert("Erreur lors de la génération du PDF: " + error.message);';
    html += '\n            });';
    html += '\n          }, 500);';
    html += '\n        };';
    html += '\n        canvas.addEventListener("mousedown", startDrawing);';
    html += '\n        canvas.addEventListener("mousemove", draw);';
    html += '\n        canvas.addEventListener("mouseup", stopDrawing);';
    html += '\n        canvas.addEventListener("mouseleave", stopDrawing);';
    html += '\n        canvas.addEventListener("touchstart", startDrawing, { passive: false });';
    html += '\n        canvas.addEventListener("touchmove", draw, { passive: false });';
    html += '\n        canvas.addEventListener("touchend", stopDrawing);';
    html += '\n        canvas.addEventListener("touchcancel", stopDrawing);';
    html += '\n        console.log("Signature prête !");';
    html += '\n      }';
    html += '\n    })();';
    html += '\n  </script>';
    html += '\n</body>';
    html += '\n</html>';
    
    return html;
  }

  const handleGenerateInteractive = async () => {
    try {
      const html = await generateInteractivePDF()
      const blob = new Blob([html], { type: 'text/html; charset=UTF-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `devis-a-signer-${devisInfo.numero}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success("Fichier à signer généré!", {
        description: "📧 Envoyez ce fichier HTML à votre client. Il signera et le PDF se téléchargera automatiquement avec le logo et la signature!",
        duration: 8000,
      })
    } catch (error) {
      console.error('Erreur lors de la génération:', error)
      toast.error("Erreur lors de la génération", {
        description: "Impossible de générer le fichier. Réessayez.",
        duration: 3000,
      })
    }
  }

  const handleSave = async () => {
    try {
      // Sauvegarder le devis via l'API MongoDB Atlas (512 MB gratuit)
      const API_ENDPOINT = '/api/devis-mongodb'
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisInfo),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }

      // Mettre à jour l'ID local si c'est un nouveau devis
      if (data.devis && data.devis.id && !devisInfo.id) {
        setDevisInfo(prev => ({ ...prev, id: data.devis.id }))
      }

      toast.success("Devis sauvegardé!", {
        description: "Le devis a été enregistré dans la base de données cloud.",
        duration: 4000,
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error("Erreur de sauvegarde", {
        description: "Impossible de sauvegarder le devis. Vérifiez votre connexion.",
        duration: 3000,
      })
    }
  }

  // Charger les informations client depuis localStorage (données de l'entreprise)
  // Note: On ne charge plus le devis depuis localStorage, il sera chargé depuis Upstash si nécessaire

  const { subtotalHT, discountAmount, totalHT, discountLabel } = calculateTotals()

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Créer un Devis
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Remplissez les informations et générez un devis professionnel
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
             <Button
               onClick={handleSave}
               variant="outline"
               className="border-[#4fafc4] text-[#4fafc4] hover:bg-[#4fafc4] hover:text-white font-semibold"
             >
               <Save className="w-4 h-4 mr-2" />
               💾 Sauvegarder
             </Button>
            <Button
              onClick={handlePreview}
              variant="outline"
              className="border-[#804d3b] text-[#804d3b] hover:bg-[#804d3b] hover:text-white font-semibold"
            >
              <Eye className="w-4 h-4 mr-2" />
              👁️ Prévisualiser
            </Button>
            
            {/* Bouton Remise */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  🏷️ Remise {devisInfo.discount && devisInfo.discount.value > 0 ? `(-${devisInfo.discount.value}%)` : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-green-600" />
                      Appliquer une remise
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sélectionnez le pourcentage de remise à appliquer sur le total
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-select">Remise</Label>
                    <Select
                      value={devisInfo.discount?.id || 'none'}
                      onValueChange={(value) => {
                        const selectedDiscount = DISCOUNTS.find(d => d.id === value)
                        if (selectedDiscount) {
                          setDevisInfo({ ...devisInfo, discount: selectedDiscount })
                          if (selectedDiscount.value > 0) {
                            toast.success(`Remise de ${selectedDiscount.value}% appliquée !`)
                          } else {
                            toast.info('Remise retirée')
                          }
                        }
                      }}
                    >
                      <SelectTrigger id="discount-select">
                        <SelectValue placeholder="Choisir une remise" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISCOUNTS.map((discount) => (
                          <SelectItem key={discount.id} value={discount.id}>
                            {discount.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {devisInfo.discount && devisInfo.discount.value > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Remise appliquée:</span>
                        <span className="font-bold text-green-600">
                          -{calculateTotals().discountAmount.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              onClick={handleGenerateInteractive}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg font-semibold"
            >
              <FileText className="w-4 h-4 mr-2" />
              📧 Envoyer au client pour signature
            </Button>
          </div>
          
          {/* Message informatif sur le flux de paiement */}
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            ✍️ Flux de signature électronique
          </h3>
          <ol className="text-sm text-gray-700 space-y-1 ml-4">
            <li>1️⃣ Le client reçoit le fichier HTML interactif</li>
            <li>2️⃣ Il signe électroniquement dans le navigateur</li>
            <li>3️⃣ Le PDF avec signature se télécharge automatiquement</li>
            <li>4️⃣ <strong className="text-green-700">Signature terminée !</strong> ✅</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs text-green-600">
              💡 <strong>Simple et efficace :</strong> Le client signe et télécharge directement le PDF signé
            </p>
          </div>
        </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du devis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#804d3b] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations du devis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Numéro</Label>
                  <Input
                    id="numero"
                    value={devisInfo.numero}
                    onChange={(e) => setDevisInfo({ ...devisInfo, numero: e.target.value })}
                    placeholder="DV-000001"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={devisInfo.date}
                    onChange={(e) => setDevisInfo({ ...devisInfo, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="validite">Validité jusqu'au</Label>
                  <Input
                    id="validite"
                    type="date"
                    value={devisInfo.validite}
                    onChange={(e) => setDevisInfo({ ...devisInfo, validite: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#804d3b]">
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientNom">Nom / Raison sociale *</Label>
                <Input
                  id="clientNom"
                  value={devisInfo.clientNom}
                  onChange={(e) => setDevisInfo({ ...devisInfo, clientNom: e.target.value })}
                  placeholder="Nom de l'entreprise ou du client"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientAdresse">Adresse</Label>
                  <Input
                    id="clientAdresse"
                    value={devisInfo.clientAdresse}
                    onChange={(e) => setDevisInfo({ ...devisInfo, clientAdresse: e.target.value })}
                    placeholder="Adresse complète"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="clientCodePostal">Code postal</Label>
                    <Input
                      id="clientCodePostal"
                      value={devisInfo.clientCodePostal}
                      onChange={(e) => setDevisInfo({ ...devisInfo, clientCodePostal: e.target.value })}
                      placeholder="75001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientVille">Ville</Label>
                    <Input
                      id="clientVille"
                      value={devisInfo.clientVille}
                      onChange={(e) => setDevisInfo({ ...devisInfo, clientVille: e.target.value })}
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientTelephone">Téléphone</Label>
                  <Input
                    id="clientTelephone"
                    value={devisInfo.clientTelephone}
                    onChange={(e) => setDevisInfo({ ...devisInfo, clientTelephone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={devisInfo.clientEmail}
                    onChange={(e) => setDevisInfo({ ...devisInfo, clientEmail: e.target.value })}
                    placeholder="client@exemple.fr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lignes du devis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-[#804d3b]">
                  Prestations / Produits
                </CardTitle>
                <Button
                  onClick={addLine}
                  size="sm"
                  className="bg-[#4fafc4] hover:bg-[#3d8a9c] text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter une ligne
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <GripVertical className="w-3 h-3" />
                Glissez les lignes pour les réorganiser
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={devisInfo.lines.map(line => line.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {devisInfo.lines.map((line, index) => (
                    <SortableLineItem
                      key={line.id}
                      line={line}
                      index={index}
                      updateLine={updateLine}
                      removeLine={removeLine}
                      totalLines={devisInfo.lines.length}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          {/* Notes et conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#804d3b]">
                Notes et conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={devisInfo.notes}
                onChange={(e) => setDevisInfo({ ...devisInfo, notes: e.target.value })}
                placeholder="Conditions de paiement, garanties, etc."
                rows={4}
              />
            </CardContent>
          </Card>

        </div>

        {/* Récapitulatif */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#804d3b] flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Sous-total */}
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-700">Sous-total HT :</span>
                  <span className="text-sm font-semibold text-gray-900">{subtotalHT.toFixed(2)} €</span>
                </div>
                
                {/* Remise */}
                {devisInfo.discount && devisInfo.discount.value > 0 && (
                  <div className="flex justify-between py-2 bg-green-50 px-3 rounded-md border border-green-200">
                    <span className="text-sm text-green-700 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Remise ({devisInfo.discount.value}%) :
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      -{discountAmount.toFixed(2)} €
                    </span>
                  </div>
                )}
                
                {/* Total final */}
                <div className="pt-3 border-t-2 border-[#4fafc4]">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg text-gray-900">Total HT :</span>
                    <span className="font-bold text-xl text-[#4fafc4]">{totalHT.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="text-xs text-gray-600">
                  <div className="flex justify-between py-1">
                    <span>Numéro :</span>
                    <span className="font-medium">{devisInfo.numero}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Date :</span>
                    <span className="font-medium">
                      {new Date(devisInfo.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Validité :</span>
                    <span className="font-medium">
                      {new Date(devisInfo.validite).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Lignes :</span>
                    <span className="font-medium">{devisInfo.lines.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleGenerateInteractive}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg font-bold text-base py-6"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  📧 Envoyer au client pour signature
                </Button>
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full border-2 border-[#804d3b] text-[#804d3b] hover:bg-[#804d3b] hover:text-white font-semibold"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  👁️ Prévisualiser le devis
                </Button>
                <div className="text-center text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  💡 <strong>Info :</strong> Le client signera sur le fichier HTML que vous lui envoyez
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prévisualisation du Devis</DialogTitle>
            <DialogDescription>
              Voici comment votre devis apparaîtra une fois téléchargé en PDF
            </DialogDescription>
          </DialogHeader>
          <div 
            className="border border-gray-200 rounded-lg p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => setShowPreview(false)}
              variant="outline"
            >
              Fermer
            </Button>
            <Button
              onClick={() => {
                setShowPreview(false)
                handleDownload()
              }}
              className="bg-[#4fafc4] hover:bg-[#3d8a9c] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


