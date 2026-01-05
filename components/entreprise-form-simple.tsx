"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Loader2, Download } from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"

export function EntrepriseFormSimple() {
  const [formData, setFormData] = useState({
    enseigne: "",
    raisonSociale: "",
    formeSociete: "",
    codeAPE: "",
    siret: "",
    adresse: "",
    codePostal: "",
    ville: "",
    prenom: "",
    nom: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    dateCreation: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generatePDF = async () => {
    setIsSubmitting(true)
    try {
      const pdf = new jsPDF("p", "mm", "a4")
      
      pdf.setFontSize(20)
      pdf.text("FICHE ENTREPRISE", 105, 20, { align: "center" })
      
      pdf.setFontSize(12)
      pdf.text(`Générée le ${new Date().toLocaleDateString('fr-FR')}`, 105, 30, { align: "center" })
      
      pdf.setFontSize(14)
      pdf.text("INFORMATIONS ENTREPRISE", 20, 50)
      
      pdf.setFontSize(10)
      let y = 60
      pdf.text(`Enseigne: ${formData.enseigne}`, 20, y)
      y += 8
      pdf.text(`Raison sociale: ${formData.raisonSociale}`, 20, y)
      y += 8
      pdf.text(`Forme juridique: ${formData.formeSociete}`, 20, y)
      y += 8
      pdf.text(`Code APE: ${formData.codeAPE}`, 20, y)
      y += 8
      pdf.text(`SIRET: ${formData.siret}`, 20, y)
      
      y += 15
      pdf.setFontSize(14)
      pdf.text("ADRESSE", 20, y)
      
      y += 10
      pdf.setFontSize(10)
      pdf.text(`Adresse: ${formData.adresse}`, 20, y)
      y += 8
      pdf.text(`Code postal: ${formData.codePostal}`, 20, y)
      y += 8
      pdf.text(`Ville: ${formData.ville}`, 20, y)
      
      y += 15
      pdf.setFontSize(14)
      pdf.text("CONTACT PRINCIPAL", 20, y)
      
      y += 10
      pdf.setFontSize(10)
      pdf.text(`Prénom: ${formData.prenom}`, 20, y)
      y += 8
      pdf.text(`Nom: ${formData.nom}`, 20, y)
      y += 8
      pdf.text(`Email: ${formData.email}`, 20, y)
      y += 8
      pdf.text(`Téléphone: ${formData.telephone}`, 20, y)
      
      if (formData.dateNaissance) {
        y += 8
        pdf.text(`Date de naissance: ${formData.dateNaissance}`, 20, y)
      }
      
      if (formData.dateCreation) {
        y += 8
        pdf.text(`Date de création: ${formData.dateCreation}`, 20, y)
      }
      
      pdf.save("fiche-entreprise.pdf")
      toast.success("PDF généré avec succès !")
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      toast.error("Erreur lors de la génération du PDF")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    const requiredFields = [
      'enseigne', 'raisonSociale', 'formeSociete', 'codeAPE', 
      'siret', 'adresse', 'codePostal', 'ville', 
      'prenom', 'nom', 'email', 'telephone'
    ]
    
    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData]
      const isEmpty = !value || value.trim() === ''
      return isEmpty
    })
    
    if (missingFields.length > 0) {
      toast.error(`Veuillez remplir tous les champs obligatoires`)
      return
    }

    await generatePDF()
  }

  return (
    <div className="h-[calc(100vh-80px)] max-w-6xl mx-auto p-2 md:p-4">
      <Card className="shadow-lg h-full flex flex-col">
        <CardContent className="p-3 md:p-6 flex-1 flex flex-col">
          <div className="text-center mb-3 md:mb-4 flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Votre entreprise</h1>
            <p className="text-xs md:text-sm text-gray-600">* Informations obligatoires</p>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {/* Informations de l'entreprise */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
              <div className="space-y-1">
                <Label htmlFor="enseigne" className="text-gray-600 text-xs">Enseigne *</Label>
                <Input
                  id="enseigne"
                  value={formData.enseigne}
                  onChange={(e) => handleInputChange("enseigne", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="raisonSociale" className="text-gray-600 text-xs">Raison sociale *</Label>
                <Input
                  id="raisonSociale"
                  value={formData.raisonSociale}
                  onChange={(e) => handleInputChange("raisonSociale", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="formeSociete" className="text-gray-600 text-xs">Forme société *</Label>
                <Select value={formData.formeSociete} onValueChange={(value) => handleInputChange("formeSociete", value)}>
                  <SelectTrigger className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto entrepreneur">Auto entrepreneur</SelectItem>
                    <SelectItem value="SARL">SARL</SelectItem>
                    <SelectItem value="SAS">SAS</SelectItem>
                    <SelectItem value="EURL">EURL</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="codeAPE" className="text-gray-600 text-xs">Code APE *</Label>
                <Input
                  id="codeAPE"
                  value={formData.codeAPE}
                  onChange={(e) => handleInputChange("codeAPE", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="siret" className="text-gray-600 text-xs">Siret *</Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => handleInputChange("siret", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-3">
              <div className="space-y-1">
                <Label htmlFor="adresse" className="text-gray-600 text-xs">Adresse *</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="codePostal" className="text-gray-600 text-xs">Code postal *</Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => handleInputChange("codePostal", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ville" className="text-gray-600 text-xs">Ville *</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleInputChange("ville", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                />
              </div>
            </div>

            {/* Contact de l'entreprise */}
            <div className="mt-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">Contact de l'entreprise</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prenom" className="text-gray-600 text-xs">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="nom" className="text-gray-600 text-xs">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="dateNaissance" className="text-gray-600 text-xs">Date naissance</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      id="dateNaissance"
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                      className="pl-7 border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-gray-600 text-xs">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="telephone" className="text-gray-600 text-xs">Téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="dateCreation" className="text-gray-600 text-xs">Date création</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      id="dateCreation"
                      type="date"
                      value={formData.dateCreation}
                      onChange={(e) => handleInputChange("dateCreation", e.target.value)}
                      className="pl-7 border-0 border-b-2 border-gray-300 rounded-none focus:border-[#e91e8c] bg-transparent text-xs h-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="mt-4 text-center flex-shrink-0">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#e91e8c] hover:bg-[#d11a7a] text-white px-6 py-2 text-sm font-semibold mr-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Génération...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Générer PDF</span>
                  </div>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  // Sauvegarder toutes les infos client dans localStorage
                  localStorage.setItem('entreprise-info', JSON.stringify({
                    enseigne: formData.enseigne,
                    raisonSociale: formData.raisonSociale,
                    formeSociete: formData.formeSociete,
                    codeAPE: formData.codeAPE,
                    siret: formData.siret,
                    adresse: formData.adresse,
                    codePostal: formData.codePostal,
                    ville: formData.ville,
                    prenom: formData.prenom,
                    nom: formData.nom,
                    dateNaissance: formData.dateNaissance,
                    email: formData.email,
                    telephone: formData.telephone,
                    dateCreation: formData.dateCreation
                  }))
                  toast.success("Informations envoyées vers le devis !")
                }}
                className="bg-[#f5a623] hover:bg-[#e09520] text-white px-6 py-2 text-sm font-semibold"
              >
                <span>Confirmer</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
