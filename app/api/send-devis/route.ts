import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const resend = new Resend(process.env.RESEND_API_KEY)

interface DevisLine { description: string; quantity: number; unitPrice: number; total: number }
interface EmetteurInfo { nom: string; adresse: string; codePostal: string; ville: string; pays: string; siren: string; email: string; telephone: string; site: string }
interface DevisData { numero: string; date: string; validite: string; clientNom: string; clientAdresse: string; clientCodePostal: string; clientVille: string; clientTelephone: string; clientEmail: string; lines: DevisLine[]; notes: string; total: number; signature: string; emetteur?: EmetteurInfo }

async function generateFacturePDF(data: DevisData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pink = rgb(1, 0.024, 0.443), black = rgb(0, 0, 0), gray = rgb(0.4, 0.4, 0.4), white = rgb(1, 1, 1)
  const em = data.emetteur || { nom: "VIVIWORKS LTD UK", adresse: "24-26 Arcadia Avenue Fin009", codePostal: "N3 2JU", ville: "Londres", pays: "Royaume-Uni", siren: "16296986", email: "contact@viviworks.ai", telephone: "", site: "viviworks.ai" }
  let y = height - 50
  
  // Charger le logo PNG
  let logoLoaded = false
  try {
    const logoResponse = await fetch("https://presentationviviworks.netlify.app/vivi.png")
    if (logoResponse.ok) {
      const logoBuffer = await logoResponse.arrayBuffer()
      const logoImage = await pdfDoc.embedPng(new Uint8Array(logoBuffer))
      const logoDims = logoImage.scale(0.08)
      page.drawImage(logoImage, { x: 50, y: y - logoDims.height + 15, width: logoDims.width, height: logoDims.height })
      logoLoaded = true
    }
  } catch (e) { console.log("Logo error:", e) }
  
  if (!logoLoaded) {
    page.drawRectangle({ x: 50, y: y - 25, width: 40, height: 40, color: pink })
    page.drawText("V", { x: 62, y: y - 12, size: 26, font: fontBold, color: white })
  }
  
  page.drawText(em.nom, { x: logoLoaded ? 95 : 100, y, size: 14, font: fontBold, color: pink })
  page.drawText(em.site, { x: logoLoaded ? 95 : 100, y: y - 14, size: 9, font, color: gray })
  page.drawText("FACTURE", { x: 240, y: height - 50, size: 26, font: fontBold, color: pink })
  page.drawText("N " + data.numero, { x: 255, y: height - 72, size: 11, font, color: gray })
  page.drawText("Date: " + data.date, { x: 440, y: height - 50, size: 10, font, color: black })
  page.drawText("Validite: " + data.validite, { x: 440, y: height - 64, size: 10, font, color: black })
  y -= 35
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 2, color: pink })
  y -= 25
  page.drawText("EMETTEUR", { x: 50, y, size: 11, font: fontBold, color: pink })
  let yL = y - 16
  page.drawText(em.nom, { x: 50, y: yL, size: 10, font: fontBold, color: black }); yL -= 13
  page.drawText(em.adresse, { x: 50, y: yL, size: 9, font, color: black }); yL -= 11
  page.drawText(em.codePostal + " " + em.ville, { x: 50, y: yL, size: 9, font, color: black }); yL -= 11
  page.drawText(em.pays, { x: 50, y: yL, size: 9, font, color: black }); yL -= 13
  if (em.siren) { page.drawText("SIREN: " + em.siren, { x: 50, y: yL, size: 9, font, color: black }); yL -= 11 }
  if (em.email) { page.drawText("Email: " + em.email, { x: 50, y: yL, size: 9, font, color: black }); yL -= 11 }
  if (em.site) { page.drawText("Web: " + em.site, { x: 50, y: yL, size: 9, font, color: black }); yL -= 11 }
  page.drawText("CLIENT", { x: 320, y, size: 11, font: fontBold, color: pink })
  let yR = y - 16
  page.drawText(data.clientNom || "Non renseigne", { x: 320, y: yR, size: 10, font: fontBold, color: black }); yR -= 13
  if (data.clientAdresse) { page.drawText(data.clientAdresse, { x: 320, y: yR, size: 9, font, color: black }); yR -= 11 }
  if (data.clientCodePostal || data.clientVille) { page.drawText(data.clientCodePostal + " " + data.clientVille, { x: 320, y: yR, size: 9, font, color: black }); yR -= 11 }
  if (data.clientTelephone) { page.drawText("Tel: " + data.clientTelephone, { x: 320, y: yR, size: 9, font, color: black }); yR -= 11 }
  if (data.clientEmail) { page.drawText("Email: " + data.clientEmail, { x: 320, y: yR, size: 9, font, color: black }); yR -= 11 }
  y = Math.min(yL, yR) - 20
  page.drawText("PRESTATIONS", { x: 50, y, size: 12, font: fontBold, color: pink }); y -= 25
  page.drawRectangle({ x: 50, y: y - 5, width: 495, height: 20, color: pink })
  page.drawText("Description", { x: 55, y, size: 9, font: fontBold, color: white })
  page.drawText("Qte", { x: 350, y, size: 9, font: fontBold, color: white })
  page.drawText("Prix unit.", { x: 400, y, size: 9, font: fontBold, color: white })
  page.drawText("Total HT", { x: 480, y, size: 9, font: fontBold, color: white }); y -= 25
  for (const line of data.lines) {
    if (y < 200) break
    const desc = line.description.length > 45 ? line.description.substring(0, 45) + "..." : line.description
    page.drawText(desc || "-", { x: 55, y, size: 9, font, color: black })
    page.drawText(String(line.quantity), { x: 355, y, size: 9, font, color: black })
    page.drawText(line.unitPrice.toFixed(2) + " EUR", { x: 395, y, size: 9, font, color: black })
    page.drawText(line.total.toFixed(2) + " EUR", { x: 475, y, size: 9, font, color: black }); y -= 18
  }
  y -= 20
  page.drawRectangle({ x: 380, y: y - 5, width: 165, height: 25, color: rgb(0.95, 0.95, 0.95) })
  page.drawText("TOTAL HT:", { x: 390, y, size: 11, font: fontBold, color: black })
  page.drawText(data.total.toFixed(2) + " EUR", { x: 480, y, size: 11, font: fontBold, color: pink })
  if (data.notes) { y -= 40; page.drawText("Notes:", { x: 50, y, size: 10, font: fontBold, color: gray }); y -= 15; page.drawText(data.notes.substring(0, 80), { x: 50, y, size: 9, font, color: gray }) }
  y -= 50
  page.drawText("SIGNATURE ELECTRONIQUE", { x: 50, y, size: 12, font: fontBold, color: pink }); y -= 20
  page.drawText("Signe le: " + new Date().toLocaleString("fr-FR"), { x: 50, y, size: 10, font, color: black })
  if (data.signature) { try { const sigData = data.signature.replace(/^data:image\/png;base64,/, ""); const sigImg = await pdfDoc.embedPng(Buffer.from(sigData, "base64")); const sigDims = sigImg.scale(0.5); y -= 10; page.drawImage(sigImg, { x: 50, y: y - sigDims.height, width: sigDims.width, height: sigDims.height }); y -= sigDims.height + 10 } catch (e) { console.error("Erreur signature:", e) } }
  y -= 20
  page.drawText("Document signe electroniquement", { x: 50, y, size: 10, font: fontBold, color: rgb(0, 0.6, 0) })
  page.drawText("Viviworks - viviworks.ai", { x: 230, y: 30, size: 9, font, color: gray })
  return await pdfDoc.save()
}

async function generateCGVPDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pink = rgb(1, 0.024, 0.443), black = rgb(0, 0, 0), gray = rgb(0.3, 0.3, 0.3)
  const page = pdfDoc.addPage([595, 842])
  let y = page.getSize().height - 50
  
  // Titre
  page.drawText("CONDITIONS GENERALES DE VENTE - VIVIWORKS", { x: 80, y, size: 14, font: fontBold, color: pink })
  y -= 30
  
  // Entre
  page.drawText("Entre :", { x: 50, y, size: 10, font: fontBold, color: black }); y -= 14
  page.drawText("La societe VIVIWORKS LTD UK", { x: 50, y, size: 9, font: fontBold, color: black }); y -= 11
  page.drawText("24-26 Arcadia Avenue Fin009, Londres, Royaume-Uni, N3 2JU", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("Siren: 16296986", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("representee par BELLARA, ci-apres denommee << le Prestataire >>.", { x: 50, y, size: 9, font, color: black }); y -= 16
  page.drawText("Et :", { x: 50, y, size: 10, font: fontBold, color: black }); y -= 14
  page.drawText("Toute personne physique ou morale souhaitant beneficier des services de VIVIWORKS,", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("ci-apres denommee << le Client >>.", { x: 50, y, size: 9, font, color: black }); y -= 20
  
  // Article 1
  page.drawText("ARTICLE 1 : OBJET ET PRESTATIONS", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("VIVIWORKS propose une prestation de creation de site internet comprenant :", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("- La conception et realisation technique (main-d oeuvre).", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("- Un service d hebergement, de gestion du nom de domaine et de maintenance technique.", { x: 60, y, size: 9, font, color: black }); y -= 18
  
  // Article 2
  page.drawText("ARTICLE 2 : TARIFS ET MODALITES DE PAIEMENT", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le client s engage a regler les sommes suivantes :", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("Frais de creation (Paiement unique) : 479 EUR TTC.", { x: 60, y, size: 9, font: fontBold, color: black }); y -= 11
  page.drawText("Ce montant correspond a la main-d oeuvre pour la conception du site. Il est exigible a la", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("signature du contrat ou selon l echeancier convenu.", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("Abonnement mensuel : 89 EUR TTC / mois.", { x: 60, y, size: 9, font: fontBold, color: black }); y -= 11
  page.drawText("Ce montant comprend l hebergement, le renouvellement du nom de domaine et la", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("maintenance evolutive/corrective du site.", { x: 60, y, size: 9, font, color: black }); y -= 18
  // Article 3
  page.drawText("ARTICLE 3 : DUREE D ENGAGEMENT ET PROPRIETE DU SITE", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le contrat prevoit une periode de paiement obligatoire pour l acquisition de la propriete :", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("Propriete intellectuelle :", { x: 60, y, size: 9, font: fontBold, color: black }); y -= 11
  page.drawText("Le site web (fichiers, base de donnees, code source) reste la propriete exclusive de", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("VIVIWORKS pendant les 12 premiers mois de l abonnement.", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("Transfert de propriete :", { x: 60, y, size: 9, font: fontBold, color: black }); y -= 11
  page.drawText("Le transfert integral de la propriete du site et des codes d acces au serveur/domaine au", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("profit du Client ne sera effectif qu apres le reglement complet des 12 premieres", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("mensualites de 89 EUR.", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("En cas d arret du paiement avant le 12eme mois, le Client perd l usage du site et ne", { x: 60, y, size: 9, font, color: black }); y -= 11
  page.drawText("pourra pretendre a la recuperation des fichiers.", { x: 60, y, size: 9, font, color: black }); y -= 18
  
  // Article 4
  page.drawText("ARTICLE 4 : DUREE ET RESILIATION", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le contrat d abonnement est conclu pour une duree indeterminee avec une periode initiale", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("d engagement de fait pour le transfert de propriete (12 mois).", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("Apres 12 mois, le Client peut resilier l abonnement par lettre recommandee ou email avec", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("un preavis de 30 jours.", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("En cas de resiliation apres 12 mois, VIVIWORKS s engage a remettre au Client une", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("sauvegarde complete du site et les codes de transfert du nom de domaine.", { x: 50, y, size: 9, font, color: black }); y -= 18
  
  // Article 5
  page.drawText("ARTICLE 5 : MAINTENANCE ET HEBERGEMENT", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("La maintenance comprend la mise a jour des plugins, la securite du site et les corrections", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("de bugs eventuels. Elle ne comprend pas l ajout de nouvelles fonctionnalites majeures ou", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("la creation de nouvelles pages non prevues au devis initial, qui feront l objet d un devis", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("separe.", { x: 50, y, size: 9, font, color: black }); y -= 18
  
  // Article 6
  page.drawText("ARTICLE 6 : RESPONSABILITE", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Le Prestataire s efforce d assurer une disponibilite du site a 99%. Toutefois, il ne pourra", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("etre tenu responsable des interruptions dues aux hebergeurs tiers ou a des cas de force", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("majeure. Le Client est responsable du contenu publie sur son site.", { x: 50, y, size: 9, font, color: black }); y -= 18
  
  // Article 7
  page.drawText("ARTICLE 7 : LITIGES", { x: 50, y, size: 10, font: fontBold, color: pink }); y -= 14
  page.drawText("Les presentes CGV sont soumises au droit francais. En cas de litige, une solution amiable", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("sera recherchee avant toute action devant les tribunaux competents de 24-26 Arcadia", { x: 50, y, size: 9, font, color: black }); y -= 11
  page.drawText("Avenue Fin009, Londres, Royaume-Uni, N3 2JU.", { x: 50, y, size: 9, font, color: black })
  
  // Footer
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
    const { error: error1 } = await resend.emails.send({
      from: "Viviworks <facture@viviworks.ai>",
      to: [email],
      subject: "Votre facture signee N " + devisData.numero + " - Viviworks",
      html: "<div style=\"font-family:Arial;max-width:600px;margin:0 auto\"><div style=\"background:linear-gradient(to right,#FF0671,#ff3d8f);padding:20px;text-align:center\"><h1 style=\"color:white;margin:0\">Viviworks</h1></div><div style=\"padding:30px;background:#f9f9f9\"><h2 style=\"color:#333\">Bonjour " + (devisData.clientNom || "cher client") + ",</h2><p style=\"color:#666\">Veuillez trouver ci-joint votre facture signee.</p><div style=\"background:white;padding:20px;border-radius:10px;margin:20px 0\"><p><strong>Facture N:</strong> " + devisData.numero + "</p><p><strong>Date:</strong> " + devisData.date + "</p><p><strong>Total HT:</strong> <span style=\"color:#FF0671;font-weight:bold\">" + devisData.total.toFixed(2) + " EUR</span></p></div><p style=\"color:#666\">Merci pour votre confiance !</p></div></div>",
      attachments: [{ filename: "Facture-" + devisData.numero + ".pdf", content: factureBase64 }]
    })
    if (error1) { console.error("Erreur facture:", error1); return NextResponse.json({ error: error1.message }, { status: 500 }) }
    await new Promise(resolve => setTimeout(resolve, 3000))
    try {
      const cgvResult = await resend.emails.send({
        from: "Viviworks <facture@viviworks.ai>",
        to: [email],
        subject: "Conditions Generales de Vente - Viviworks",
        html: "<div style=\"font-family:Arial;max-width:600px;margin:0 auto\"><div style=\"background:linear-gradient(to right,#FF0671,#ff3d8f);padding:20px;text-align:center\"><h1 style=\"color:white;margin:0\">Viviworks</h1></div><div style=\"padding:30px;background:#f9f9f9\"><h2 style=\"color:#333\">Bonjour " + (devisData.clientNom || "cher client") + ",</h2><p style=\"color:#666\">Veuillez trouver ci-joint nos Conditions Generales de Vente.</p></div></div>",
        attachments: [{ filename: "CGV-Viviworks.pdf", content: cgvBase64 }]
      })
      if (cgvResult.error) return NextResponse.json({ success: true, message: "Facture envoyee, erreur CGV" })
    } catch (e) { return NextResponse.json({ success: true, message: "Facture envoyee, exception CGV" }) }
    return NextResponse.json({ success: true, message: "Facture et CGV envoyees a " + email })
  } catch (error) { console.error("Erreur:", error); return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }) }
}
