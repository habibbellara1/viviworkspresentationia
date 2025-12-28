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
      
      // Titre
      pdf.setFontSize(20)
      pdf.text("FICHE ENTREPRISE", 105, 20, { align: "center" })
      
      // Date
      pdf.setFontSize(12)
      pdf.text(`Générée le ${new Date().toLocaleDateString('fr-FR')}`, 105, 30, { align: "center" })
      
      // Informations entreprise
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
      
      // Adresse
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
      
      // Contact
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
    // Validation des champs obligatoires
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
      toast.error(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`)
      return
    }

    await generatePDF()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 px-4">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Votre entreprise</h1>
        <p className="text-sm md:text-base text-gray-600">
          * Informations obligatoires à récupérer si on ne les a pas déjà
        </p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-4 md:p-8">
          <div className="space-y-6 md:space-y-8">
            {/* Informations de l'entreprise */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="enseigne" className="text-gray-600 text-sm md:text-base">
                  Enseigne *
                </Label>
                <Input
                  id="enseigne"
                  value={formData.enseigne}
                  onChange={(e) => handleInputChange("enseigne", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-[#804d3b] bg-transparent text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="raisonSociale" className="text-gray-600 text-sm md:text-base">
                  Raison sociale *
                </Label>
                <Input
                  id="raisonSociale"
                  value={formData.raisonSociale}
                  onChange={(e) => handleInputChange("raisonSociale", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formeSociete" className="text-gray-600 text-sm md:text-base">
                  Forme de la société *
                </Label>
                <Select
                  value={formData.formeSociete}
                  onValueChange={(value) => handleInputChange("formeSociete", value)}
                >
                  <SelectTrigger className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base">
                    <SelectValue placeholder="Sélectionnez la forme juridique" />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="codeAPE" className="text-gray-600 text-sm md:text-base">
                  Code APE *
                </Label>
                <Input
                  id="codeAPE"
                  value={formData.codeAPE}
                  onChange={(e) => handleInputChange("codeAPE", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siret" className="text-gray-600 text-sm md:text-base">
                  Siret *
                </Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => handleInputChange("siret", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-gray-600 text-sm md:text-base">
                  Adresse *
                </Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codePostal" className="text-gray-600 text-sm md:text-base">
                  Code postal *
                </Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => handleInputChange("codePostal", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ville" className="text-gray-600 text-sm md:text-base">
                  Ville *
                </Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleInputChange("ville", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                />
              </div>
            </div>

            {/* Contact de l'entreprise */}
            <div className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Contact de l'entreprise</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-gray-600 text-sm md:text-base">
                    Prénom *
                  </Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-gray-600 text-sm md:text-base">
                    Nom *
                  </Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateNaissance" className="text-gray-600 text-sm md:text-base">
                    Date de naissance
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="dateNaissance"
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                      className="pl-10 border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-600 text-sm md:text-base">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-gray-600 text-sm md:text-base">
                    Téléphone *
                  </Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateCreation" className="text-gray-600 text-sm md:text-base">
                    Date de création
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="dateCreation"
                      type="date"
                      value={formData.dateCreation}
                      onChange={(e) => handleInputChange("dateCreation", e.target.value)}
                      className="pl-10 border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 bg-transparent text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de génération PDF */}
            <div className="mt-8 md:mt-12 text-center">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#e91e8c] hover:bg-[#d11a7a] text-white px-8 py-3 text-lg font-semibold mr-4"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Génération en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    <span>Générer PDF</span>
                  </div>
                )}
              </Button>
              
              {/* Bouton Confirmer pour envoyer vers l'offre de partenariat */}
              <Button
                onClick={() => {
                  // Sauvegarder les informations dans localStorage pour les récupérer dans l'offre
                  localStorage.setItem('entreprise-info', JSON.stringify({
                    adresse: formData.adresse,
                    codePostal: formData.codePostal,
                    ville: formData.ville,
                    telephone: formData.telephone,
                    email: formData.email
                  }))
                  
                  // Afficher un message de confirmation
                  toast.success("Informations confirmées ! Vous pouvez maintenant consulter l'offre de partenariat.")
                }}
                className="bg-[#f5a623] hover:bg-[#e09520] text-white px-8 py-3 text-lg font-semibold"
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