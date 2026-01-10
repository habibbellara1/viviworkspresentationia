import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

async function generateCGVPDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pink = rgb(1, 0.024, 0.443)
  const black = rgb(0, 0, 0)
  const gray = rgb(0.3, 0.3, 0.3)

  const page = pdfDoc.addPage([595, 842])
  let y = page.getSize().height - 50

  page.drawText('CONDITIONS GENERALES DE VENTE - VIVIWORKS', { x: 80, y, size: 16, font: fontBold, color: pink })
  y -= 40

  page.drawText('Entre :', { x: 50, y, size: 10, font: fontBold, color: black })
  y -= 15
  page.drawText('La societe VIVIWORKS LTD UK', { x: 50, y, size: 9, font: fontBold, color: black })
  y -= 12
  page.drawText('24-26 Arcadia Avenue Fin009, Londres, Royaume-Uni, N3 2JU', { x: 50, y, size: 9, font, color: black })
  y -= 12
  page.drawText('Siren: 16296986', { x: 50, y, size: 9, font, color: black })
  y -= 12
  page.drawText('representee par BELLARA, ci-apres denommee << le Prestataire >>.', { x: 50, y, size: 9, font, color: black })
  y -= 20
  page.drawText('Et :', { x: 50, y, size: 10, font: fontBold, color: black })
  y -= 15
  page.drawText('Toute personne physique ou morale souhaitant beneficier des services de VIVIWORKS,', { x: 50, y, size: 9, font, color: black })
  y -= 12
  page.drawText('ci-apres denommee << le Client >>.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 1 : OBJET ET PRESTATIONS', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('VIVIWORKS propose une prestation de creation de site internet comprenant :', { x: 50, y, size: 9, font, color: black })
  y -= 14
  page.drawText('- La conception et realisation technique (main-d\'oeuvre).', { x: 60, y, size: 9, font, color: black })
  y -= 12
  page.drawText('- Un service d\'hebergement, de gestion du nom de domaine et de maintenance technique.', { x: 60, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 2 : TARIFS ET MODALITES DE PAIEMENT', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Le client s\'engage a regler les sommes suivantes :', { x: 50, y, size: 9, font, color: black })
  y -= 16
  page.drawText('Frais de creation (Paiement unique) : 479 EUR TTC.', { x: 60, y, size: 9, font: fontBold, color: black })
  y -= 12
  page.drawText('Ce montant correspond a la main-d\'oeuvre pour la conception du site. Il est exigible a la', { x: 60, y, size: 9, font, color: black })
  y -= 12
  page.drawText('signature du contrat ou selon l\'echeancier convenu.', { x: 60, y, size: 9, font, color: black })
  y -= 16
  page.drawText('Abonnement mensuel : 89 EUR TTC / mois.', { x: 60, y, size: 9, font: fontBold, color: black })
  y -= 12
  page.drawText('Ce montant comprend l\'hebergement, le renouvellement du nom de domaine et la', { x: 60, y, size: 9, font, color: black })
  y -= 12
  page.drawText('maintenance evolutive/corrective du site.', { x: 60, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 3 : DUREE D\'ENGAGEMENT ET PROPRIETE DU SITE', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Le contrat prevoit une periode de paiement obligatoire pour l\'acquisition de la propriete :', { x: 50, y, size: 9, font, color: black })
  y -= 16
  page.drawText('Propriete intellectuelle : Le site web reste la propriete exclusive de VIVIWORKS pendant', { x: 60, y, size: 9, font, color: black })
  y -= 12
  page.drawText('les 12 premiers mois de l\'abonnement.', { x: 60, y, size: 9, font, color: black })
  y -= 14
  page.drawText('Transfert de propriete : Effectif apres le reglement complet des 12 premieres mensualites.', { x: 60, y, size: 9, font, color: black })
  y -= 14
  page.drawText('En cas d\'arret du paiement avant le 12eme mois, le Client perd l\'usage du site.', { x: 60, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 4 : DUREE ET RESILIATION', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Contrat a duree indeterminee avec engagement initial de 12 mois.', { x: 50, y, size: 9, font, color: black })
  y -= 14
  page.drawText('Apres 12 mois, resiliation possible par lettre recommandee ou email avec preavis de 30 jours.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 5 : MAINTENANCE ET HEBERGEMENT', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('La maintenance comprend la mise a jour des plugins, la securite du site et les corrections', { x: 50, y, size: 9, font, color: black })
  y -= 12
  page.drawText('de bugs. Les nouvelles fonctionnalites majeures feront l\'objet d\'un devis separe.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 6 : RESPONSABILITE', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Le Prestataire assure une disponibilite du site a 99%. Non responsable des interruptions', { x: 50, y, size: 9, font, color: black })
  y -= 12
  page.drawText('dues aux hebergeurs tiers ou cas de force majeure. Le Client est responsable du contenu.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 7 : LITIGES', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Les presentes CGV sont soumises au droit francais. En cas de litige, une solution amiable', { x: 50, y, size: 9, font, color: black })
  y -= 12
  page.drawText('sera recherchee avant toute action devant les tribunaux competents.', { x: 50, y, size: 9, font, color: black })

  page.drawText('VIVIWORKS LTD UK - viviworks.ai', { x: 210, y: 30, size: 9, font, color: gray })

  return await pdfDoc.save()
}

export async function GET() {
  try {
    const pdfBytes = await generateCGVPDF()
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="CGV-Viviworks.pdf"'
      }
    })
  } catch (error) {
    console.error('Erreur generation CGV:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
