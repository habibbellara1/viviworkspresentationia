import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const resend = new Resend(process.env.RESEND_API_KEY)

interface DevisLine { description: string; quantity: number; unitPrice: number; total: number; periodicity?: string }
interface EmetteurInfo { nom: string; adresse: string; codePostal: string; ville: string; pays: string; siren: string; email: string; telephone: string; site: string }
interface DevisData { numero: string; date: string; validite: string; clientNom: string; clientAdresse: string; clientCodePostal: string; clientVille: string; clientTelephone: string; clientEmail: string; lines: DevisLine[]; notes: string; total: number; signature: string; emetteur?: EmetteurInfo }

const prestationDetails: { [key: string]: string } = {
  "Site vitrine": "Conception du site vitrine (graphisme et redactionnel) responsive design",
  "Nom de domaine": "Nom de domaine personnalise et adresse e-mail associee",
  "Formation": "Prendre en main l'outil de mise a jour Vivitool",
  "Frais de mise en oeuvre": "Site jusqu'a 10 pages",
  "Communication Web": "Annuaire local.fr",
  "Hébergement, administration et référencement": "SEO, hebergement, SSL, mises a jour, accompagnement expert, Google Ads"
}

const hebergementServices = [
  "Optimisation SEO (Google, Yahoo, Bing)",
  "Hebergement securise + Certificat SSL (https)",
  "Mises a jour de contenu illimitees",
  "Gestionnaire de contenu Vivitool",
  "Accompagnement expert Viviworks",
  "Campagne Google Ads",
  "Creation page Facebook et Google My Business",
  "Diffusion sur annuaires et GPS (Google Maps, Waze)",
  "Garantie de visites (100 visites/mois)"
]

async function generateFacturePDF(data: DevisData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pink = rgb(1, 0.024, 0.443), black = rgb(0, 0, 0), gray = rgb(0.4, 0.4, 0.4), white = rgb(1, 1, 1), lightGray = rgb(0.95, 0.95, 0.95), green = rgb(0, 0.6, 0)
  const em = data.emetteur || { nom: "VIVIWORKS LTD UK", adresse: "24-26 Arcadia Avenue Fin009", codePostal: "N3 2JU", ville: "Londres", pays: "Royaume-Uni", siren: "16296986", email: "contact@viviworks.ai", telephone: "", site: "viviworks.ai" }
  
  // PAGE 1 - DETAILS DES PRESTATIONS
  const page1 = pdfDoc.addPage([595, 842])
  const { height } = page1.getSize()
  let y = height - 50
  
  // Logo
  try {
    const logoRes = await fetch("https://presentationviviworks.netlify.app/vivi.png")
    if (logoRes.ok) {
      const logoBuf = await logoRes.arrayBuffer()
      const logoImg = await pdfDoc.embedPng(new Uint8Array(logoBuf))
      page1.drawImage(logoImg, { x: 50, y: y - 18, width: 28, height: 28 })
    }
  } catch (e) {
    page1.drawRectangle({ x: 50, y: y - 18, width: 28, height: 28, color: pink })
    page1.drawText("V", { x: 57, y: y - 8, size: 18, font: fontBold, color: white })
  }
  
  page1.drawText(em.nom, { x: 85, y, size: 13, font: fontBold, color: pink })
  page1.drawText(em.site, { x: 85, y: y - 13, size: 9, font, color: gray })
  page1.drawText("FACTURE", { x: 420, y: height - 50, size: 22, font: fontBold, color: pink })
  page1.drawText("N " + data.numero, { x: 420, y: height - 70, size: 10, font, color: gray })
  
  // Infos date - positionnées plus haut
  page1.drawText("Date : " + data.date, { x: 420, y: height - 90, size: 9, font, color: black })
  page1.drawText("Validite : " + data.validite, { x: 420, y: height - 102, size: 9, font, color: black })
  
  y -= 70
  page1.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 2, color: pink })
  y -= 25
  
  // Emetteur et Client côte à côte
  page1.drawRectangle({ x: 50, y: y - 70, width: 230, height: 80, color: lightGray, borderColor: pink, borderWidth: 1 })
  page1.drawText("EMETTEUR", { x: 60, y: y - 5, size: 10, font: fontBold, color: pink })
  let yE = y - 20
  page1.drawText(em.nom, { x: 60, y: yE, size: 9, font: fontBold, color: black }); yE -= 11
  page1.drawText(em.adresse, { x: 60, y: yE, size: 8, font, color: black }); yE -= 10
  page1.drawText(em.codePostal + " " + em.ville + ", " + em.pays, { x: 60, y: yE, size: 8, font, color: black }); yE -= 10
  page1.drawText("SIREN: " + em.siren, { x: 60, y: yE, size: 8, font, color: black }); yE -= 10
  page1.drawText("Email: " + em.email, { x: 60, y: yE, size: 8, font, color: black })
  
  page1.drawRectangle({ x: 310, y: y - 70, width: 235, height: 80, color: lightGray, borderColor: pink, borderWidth: 1 })
  page1.drawText("CLIENT", { x: 320, y: y - 5, size: 10, font: fontBold, color: pink })
  let yC = y - 20
  page1.drawText(data.clientNom || "Non renseigne", { x: 320, y: yC, size: 9, font: fontBold, color: black }); yC -= 11
  if (data.clientAdresse) { page1.drawText(data.clientAdresse, { x: 320, y: yC, size: 8, font, color: black }); yC -= 10 }
  if (data.clientCodePostal || data.clientVille) { page1.drawText((data.clientCodePostal || "") + " " + (data.clientVille || ""), { x: 320, y: yC, size: 8, font, color: black }); yC -= 10 }
  if (data.clientTelephone) { page1.drawText("Tel: " + data.clientTelephone, { x: 320, y: yC, size: 8, font, color: black }); yC -= 10 }
  if (data.clientEmail) { page1.drawText("Email: " + data.clientEmail, { x: 320, y: yC, size: 8, font, color: black }) }
  
  y -= 100
  
  // Titre section prestations
  page1.drawText("DETAIL DES PRESTATIONS", { x: 50, y, size: 12, font: fontBold, color: pink })
  y -= 25
  
  // En-tête tableau
  page1.drawRectangle({ x: 50, y: y - 5, width: 495, height: 20, color: pink })
  page1.drawText("Designation", { x: 60, y, size: 9, font: fontBold, color: white })
  page1.drawText("Prix HT", { x: 400, y, size: 9, font: fontBold, color: white })
  page1.drawText("Periodicite", { x: 470, y, size: 9, font: fontBold, color: white })
  y -= 25
  
  // Afficher toutes les prestations sauf hébergement
  let alternate = false
  let hebergementLine: DevisLine | null = null
  
  for (const line of data.lines) {
    // Détecter la ligne hébergement
    if (line.description.toLowerCase().includes("hebergement") || line.description.toLowerCase().includes("hébergement")) {
      hebergementLine = line
      continue
    }
    
    if (y < 150) break
    
    const rowHeight = 32
    if (alternate) {
      page1.drawRectangle({ x: 50, y: y - rowHeight + 15, width: 495, height: rowHeight, color: lightGray })
    }
    
    const titre = line.description
    const desc = prestationDetails[titre] || ""
    const isOffered = line.unitPrice === 0
    
    page1.drawText(titre, { x: 60, y, size: 9, font: fontBold, color: pink })
    y -= 11
    
    if (desc) {
      const descTrunc = desc.length > 70 ? desc.substring(0, 70) + "..." : desc
      page1.drawText(descTrunc, { x: 60, y, size: 7, font, color: gray })
    }
    
    if (isOffered) {
      page1.drawText("OFFERT", { x: 405, y: y + 5, size: 9, font: fontBold, color: green })
    } else {
      page1.drawText(line.unitPrice.toFixed(2) + " EUR", { x: 395, y: y + 5, size: 9, font: fontBold, color: black })
      if (line.periodicity) {
        page1.drawText(line.periodicity, { x: 470, y: y + 5, size: 7, font, color: gray })
      }
    }
    
    y -= 21
    alternate = !alternate
  }
  
  // Section Hébergement avec détails
  if (hebergementLine || true) {
    y -= 10
    const hLine = hebergementLine || { unitPrice: 89, periodicity: "Mensuel" }
    const isOffered = hLine.unitPrice === 0
    
    // Titre hébergement
    page1.drawRectangle({ x: 50, y: y - 5, width: 495, height: 22, color: pink })
    page1.drawText("Hebergement, administration et referencement", { x: 60, y, size: 10, font: fontBold, color: white })
    if (isOffered) {
      page1.drawText("OFFERT", { x: 405, y, size: 9, font: fontBold, color: rgb(0.8, 1, 0.8) })
    } else {
      page1.drawText(hLine.unitPrice.toFixed(2) + " EUR", { x: 395, y, size: 9, font: fontBold, color: white })
      page1.drawText("Mensuel", { x: 470, y, size: 7, font, color: white })
    }
    y -= 25
    
    // Liste des services inclus
    page1.drawText("Services inclus :", { x: 60, y, size: 8, font: fontBold, color: pink })
    y -= 12
    
    for (const service of hebergementServices) {
      if (y < 50) break
      page1.drawText("•", { x: 65, y, size: 7, font: fontBold, color: pink })
      page1.drawText(service, { x: 75, y, size: 7, font, color: black })
      y -= 10
    }
  }
  
  page1.drawText("Page 1/2", { x: 280, y: 30, size: 8, font, color: gray })
  
  // PAGE 2 - RECAPITULATIF ET SIGNATURE
  const page2 = pdfDoc.addPage([595, 842])
  y = height - 50
  
  // En-tête page 2
  page2.drawText("FACTURE N " + data.numero, { x: 50, y, size: 14, font: fontBold, color: pink })
  page2.drawText("Date : " + data.date, { x: 420, y, size: 9, font, color: black })
  y -= 25
  page2.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 2, color: pink })
  y -= 30
  
  // RECAPITULATIF
  page2.drawText("RECAPITULATIF", { x: 50, y, size: 12, font: fontBold, color: pink })
  y -= 25
  
  // En-tête tableau récap
  page2.drawRectangle({ x: 50, y: y - 5, width: 495, height: 20, color: pink })
  page2.drawText("Prestation", { x: 60, y, size: 9, font: fontBold, color: white })
  page2.drawText("Montant HT", { x: 400, y, size: 9, font: fontBold, color: white })
  page2.drawText("Periodicite", { x: 470, y, size: 9, font: fontBold, color: white })
  y -= 25
  
  let totalUnique = 0
  let totalMensuel = 0
  let totalAnnuel = 0
  
  alternate = false
  for (const line of data.lines) {
    if (alternate) {
      page2.drawRectangle({ x: 50, y: y - 5, width: 495, height: 18, color: lightGray })
    }
    
    const isOffered = line.unitPrice === 0
    page2.drawText(line.description, { x: 60, y, size: 8, font, color: black })
    
    if (isOffered) {
      page2.drawText("OFFERT", { x: 405, y, size: 8, font: fontBold, color: green })
    } else {
      page2.drawText(line.unitPrice.toFixed(2) + " EUR", { x: 400, y, size: 8, font: fontBold, color: black })
      if (line.periodicity) {
        page2.drawText(line.periodicity, { x: 470, y, size: 7, font, color: gray })
      }
      
      if (line.periodicity === "Mensuel") {
        totalMensuel += line.unitPrice
      } else if (line.periodicity === "Annuel") {
        totalAnnuel += line.unitPrice
      } else {
        totalUnique += line.unitPrice
      }
    }
    
    y -= 18
    alternate = !alternate
  }
  
  y -= 15
  page2.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: pink })
  y -= 25
  
  // Totaux
  if (totalUnique > 0) {
    page2.drawText("Total versements uniques :", { x: 280, y, size: 10, font, color: black })
    page2.drawText(totalUnique.toFixed(2) + " EUR HT", { x: 450, y, size: 10, font: fontBold, color: black })
    y -= 18
  }
  if (totalMensuel > 0) {
    page2.drawText("Total mensuel :", { x: 280, y, size: 10, font, color: black })
    page2.drawText(totalMensuel.toFixed(2) + " EUR HT/mois", { x: 450, y, size: 10, font: fontBold, color: black })
    y -= 18
  }
  if (totalAnnuel > 0) {
    page2.drawText("Total annuel :", { x: 280, y, size: 10, font, color: black })
    page2.drawText(totalAnnuel.toFixed(2) + " EUR HT/an", { x: 450, y, size: 10, font: fontBold, color: black })
    y -= 18
  }
  
  // Total général
  y -= 15
  page2.drawRectangle({ x: 260, y: y - 12, width: 285, height: 35, color: pink })
  page2.drawText("TOTAL A PAYER :", { x: 275, y, size: 12, font: fontBold, color: white })
  page2.drawText(data.total.toFixed(2) + " EUR HT", { x: 420, y, size: 14, font: fontBold, color: white })
  
  y -= 60
  
  // Notes
  if (data.notes) {
    page2.drawText("Notes :", { x: 50, y, size: 10, font: fontBold, color: gray })
    y -= 14
    page2.drawText(data.notes.substring(0, 100), { x: 50, y, size: 8, font, color: gray })
    y -= 30
  }
  
  // Signature
  page2.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: lightGray })
  y -= 25
  
  page2.drawText("SIGNATURE ELECTRONIQUE", { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page2.drawText("Document signe electroniquement le " + new Date().toLocaleString("fr-FR"), { x: 50, y, size: 9, font, color: black })
  
  if (data.signature) {
    try {
      const sigData = data.signature.replace(/^data:image\/png;base64,/, "")
      const sigImg = await pdfDoc.embedPng(Buffer.from(sigData, "base64"))
      const sigDims = sigImg.scale(0.35)
      y -= 15
      page2.drawImage(sigImg, { x: 50, y: y - sigDims.height, width: sigDims.width, height: sigDims.height })
      y -= sigDims.height + 10
    } catch (e) { console.error("Erreur signature:", e) }
  }
  
  y -= 10
  page2.drawRectangle({ x: 50, y: y - 5, width: 200, height: 20, color: rgb(0.9, 1, 0.9) })
  page2.drawText("Document valide et signe", { x: 60, y, size: 9, font: fontBold, color: green })
  
  page2.drawText("Page 2/2", { x: 280, y: 30, size: 8, font, color: gray })
  page2.drawText("VIVIWORKS LTD UK - viviworks.ai", { x: 200, y: 15, size: 8, font, color: gray })
  
  return await pdfDoc.save()
}


async function generateCGVPDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pink = rgb(1, 0.024, 0.443), black = rgb(0, 0, 0), gray = rgb(0.3, 0.3, 0.3)
  const page = pdfDoc.addPage([595, 842])
  let y = page.getSize().height - 40
  page.drawText("CONDITIONS GENERALES DE VENTE - VIVIWORKS", { x: 80, y, size: 14, font: fontBold, color: pink }); y -= 30
  page.drawText("Entre :", { x: 50, y, size: 9, font: fontBold, color: black }); y -= 12
  page.drawText("La societe VIVIWORKS LTD UK, 24-26 Arcadia Avenue Fin009, Londres, Royaume-Uni, N3 2JU", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("Siren: 16296986, representee par BELLARA, ci-apres denommee << le Prestataire >>.", { x: 50, y, size: 8, font, color: black }); y -= 14
  page.drawText("Et :", { x: 50, y, size: 9, font: fontBold, color: black }); y -= 12
  page.drawText("Toute personne physique ou morale souhaitant beneficier des services de VIVIWORKS,", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("ci-apres denommee << le Client >>.", { x: 50, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 1 : OBJET ET PRESTATIONS", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("VIVIWORKS propose une prestation de creation de site internet comprenant :", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("- La conception et realisation technique (main-d oeuvre).", { x: 60, y, size: 8, font, color: black }); y -= 10
  page.drawText("- Un service d hebergement, de gestion du nom de domaine et de maintenance technique.", { x: 60, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 2 : TARIFS ET MODALITES DE PAIEMENT", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le client s engage a regler les sommes suivantes :", { x: 50, y, size: 8, font, color: black }); y -= 12
  page.drawText("Frais de mise en service (Paiement unique) : 479 EUR HT.", { x: 60, y, size: 8, font: fontBold, color: black }); y -= 10
  page.drawText("Ce montant correspond a la main-d oeuvre pour la conception initiale du site.", { x: 60, y, size: 8, font, color: black }); y -= 12
  page.drawText("Abonnement mensuel : 89 EUR HT / mois.", { x: 60, y, size: 8, font: fontBold, color: black }); y -= 10
  page.drawText("Ce montant couvre l hebergement, le renouvellement du nom de domaine et la maintenance.", { x: 60, y, size: 8, font, color: black }); y -= 12
  page.drawText("Calendrier de prelevement : Le premier prelevement sera effectue le 15 du mois suivant", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("la signature du present contrat.", { x: 50, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 3 : DUREE D ENGAGEMENT ET PROPRIETE DU SITE", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le contrat prevoit une periode de paiement liee a l acquisition de la propriete :", { x: 50, y, size: 8, font, color: black }); y -= 12
  page.drawText("Propriete intellectuelle : Le site web reste la propriete exclusive de VIVIWORKS durant", { x: 60, y, size: 8, font, color: black }); y -= 10
  page.drawText("toute la periode de location/maintenance.", { x: 60, y, size: 8, font, color: black }); y -= 12
  page.drawText("Transfert de propriete : Pour devenir proprietaire integral du site web, le Client doit", { x: 60, y, size: 8, font, color: black }); y -= 10
  page.drawText("avoir regle la somme totale de 1 547 EUR HT (479 EUR + 12 x 89 EUR).", { x: 60, y, size: 8, font, color: black }); y -= 12
  page.drawText("Recuperation anticipee : Le Client peut demander le transfert avant 12 mois en", { x: 60, y, size: 8, font, color: black }); y -= 10
  page.drawText("s acquittant du solde restant pour atteindre 1 547 EUR HT.", { x: 60, y, size: 8, font, color: black }); y -= 12
  page.drawText("En cas d arret de paiement avant le reglement total, le Client perd l usage du site.", { x: 60, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 4 : DUREE ET RESILIATION", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le contrat est conclu pour une duree indeterminee avec une periode initiale d engagement", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("moral de 12 mois. Apres ces 12 mois et si la totalite (1 547 EUR) a ete versee, le Client", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("peut resilier par email ou lettre recommandee avec un preavis de 30 jours.", { x: 50, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 5 : MAINTENANCE ET HEBERGEMENT", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("La maintenance comprend la mise a jour des plugins, la securite du site et les corrections", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("de bugs. Les nouvelles fonctionnalites majeures feront l objet d un devis separe.", { x: 50, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 6 : RESPONSABILITE", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le Prestataire s efforce d assurer une disponibilite du site a 99%. Il ne pourra etre tenu", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("responsable des interruptions dues aux hebergeurs tiers. Le Client est responsable du contenu.", { x: 50, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 7 : PROTECTION DES DONNEES (RGPD)", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Conformement au RGPD, VIVIWORKS s engage a :", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("- Ne collecter que les donnees strictement necessaires a la facturation et au support.", { x: 60, y, size: 8, font, color: black }); y -= 10
  page.drawText("- Garantir au Client un droit d acces, de rectification et de suppression de ses donnees.", { x: 60, y, size: 8, font, color: black }); y -= 10
  page.drawText("- Assurer la securite des donnees stockees sur ses serveurs.", { x: 60, y, size: 8, font, color: black }); y -= 10
  page.drawText("Le Client est responsable de la conformite RGPD des donnees collectees via son site.", { x: 50, y, size: 8, font, color: black }); y -= 18
  page.drawText("ARTICLE 8 : LITIGES", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Les presentes CGV sont soumises au droit francais. En cas de litige, une solution amiable", { x: 50, y, size: 8, font, color: black }); y -= 10
  page.drawText("sera recherchee avant toute action devant les tribunaux competents de Londres.", { x: 50, y, size: 8, font, color: black })
  page.drawText("VIVIWORKS LTD UK - viviworks.ai", { x: 210, y: 30, size: 9, font, color: gray })
  return await pdfDoc.save()
}

export async function POST(request: Request) {
  try {
    const { email, devisData, signature } = await request.json()
    if (!email || !devisData || !signature) return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 })
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Service email non configure" }, { status: 500 })
    const facturePdf = await generateFacturePDF({ ...devisData, signature })
    const cgvPdf = await generateCGVPDF()
    const factureBase64 = Buffer.from(facturePdf).toString("base64")
    const cgvBase64 = Buffer.from(cgvPdf).toString("base64")
    const { error } = await resend.emails.send({
      from: "Viviworks <facture@viviworks.ai>",
      to: [email],
      subject: "Votre facture signee N " + devisData.numero + " et CGV - Viviworks",
      html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(to right,#FF0671,#ff3d8f);padding:20px;text-align:center">
          <h1 style="color:white;margin:0">Viviworks</h1>
        </div>
        <div style="padding:30px;background:#f9f9f9">
          <h2 style="color:#333">Bonjour ${devisData.clientNom || "cher client"},</h2>
          <p style="color:#666">Veuillez trouver ci-joint votre facture signee ainsi que nos Conditions Generales de Vente.</p>
          <div style="background:white;padding:20px;border-radius:10px;margin:20px 0">
            <p><strong>Facture N:</strong> ${devisData.numero}</p>
            <p><strong>Date:</strong> ${devisData.date}</p>
            <p><strong>Total HT:</strong> <span style="color:#FF0671;font-weight:bold">${devisData.total.toFixed(2)} EUR</span></p>
          </div>
          <div style="background:#fff3f8;padding:15px;border-radius:10px;margin:20px 0;border:1px solid #FF0671">
            <p style="color:#333;margin:0"><strong>📎 Documents joints :</strong></p>
            <p style="margin:5px 0;color:#666">• Facture N ${devisData.numero}</p>
            <p style="margin:5px 0;color:#666">• Conditions Generales de Vente (CGV)</p>
          </div>
          <p style="color:#666">Merci pour votre confiance !</p>
        </div>
        <div style="background:#333;padding:15px;text-align:center">
          <p style="color:#999;margin:0;font-size:12px">Viviworks - viviworks.ai</p>
        </div>
      </div>`,
      attachments: [
        { filename: "Facture-" + devisData.numero + ".pdf", content: factureBase64 },
        { filename: "CGV-Viviworks.pdf", content: cgvBase64 }
      ]
    })
    if (error) { console.error("Erreur envoi:", error); return NextResponse.json({ error: error.message }, { status: 500 }) }
    return NextResponse.json({ success: true, message: "Facture et CGV envoyees a " + email })
  } catch (error) { console.error("Erreur:", error); return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }) }
}
