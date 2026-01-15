import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const resend = new Resend(process.env.RESEND_API_KEY)

async function generateCGVPDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pink = rgb(1, 0.024, 0.443)
  const black = rgb(0, 0, 0)
  const gray = rgb(0.3, 0.3, 0.3)

  const page = pdfDoc.addPage([595, 842])
  let y = page.getSize().height - 40

  page.drawText('CONDITIONS GENERALES DE VENTE - VIVIWORKS', { x: 80, y, size: 14, font: fontBold, color: pink })
  y -= 30

  page.drawText('Entre :', { x: 50, y, size: 9, font: fontBold, color: black })
  y -= 12
  page.drawText('La societe VIVIWORKS LTD UK, 24-26 Arcadia Avenue Fin009, Londres, Royaume-Uni, N3 2JU', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('Siren: 16296986, representee par BELLARA, ci-apres denommee << le Prestataire >>.', { x: 50, y, size: 8, font, color: black })
  y -= 14
  page.drawText('Et :', { x: 50, y, size: 9, font: fontBold, color: black })
  y -= 12
  page.drawText('Toute personne physique ou morale souhaitant beneficier des services de VIVIWORKS,', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('ci-apres denommee << le Client >>.', { x: 50, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 1 : OBJET ET PRESTATIONS', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('VIVIWORKS propose une prestation de creation de site internet comprenant :', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('- La conception et realisation technique (main-d\'oeuvre).', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('- Un service d\'hebergement, de gestion du nom de domaine et de maintenance technique.', { x: 60, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 2 : TARIFS ET MODALITES DE PAIEMENT', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('Le client s\'engage a regler les sommes suivantes :', { x: 50, y, size: 8, font, color: black })
  y -= 12
  page.drawText('Frais de mise en service (Paiement unique) : 479 EUR HT.', { x: 60, y, size: 8, font: fontBold, color: black })
  y -= 10
  page.drawText('Ce montant correspond a la main-d\'oeuvre pour la conception initiale du site.', { x: 60, y, size: 8, font, color: black })
  y -= 12
  page.drawText('Abonnement mensuel : 89 EUR HT / mois.', { x: 60, y, size: 8, font: fontBold, color: black })
  y -= 10
  page.drawText('Ce montant couvre l\'hebergement, le renouvellement du nom de domaine et la maintenance.', { x: 60, y, size: 8, font, color: black })
  y -= 12
  page.drawText('Calendrier de prelevement : Le premier prelevement (incluant les frais de mise en service', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('et/ou la premiere mensualite selon l\'echeancier) sera effectue le 15 du mois suivant la', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('signature du present contrat.', { x: 50, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 3 : DUREE D\'ENGAGEMENT ET PROPRIETE DU SITE', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('Le contrat prevoit une periode de paiement liee a l\'acquisition de la propriete :', { x: 50, y, size: 8, font, color: black })
  y -= 12
  page.drawText('Propriete intellectuelle : Le site web (fichiers, base de donnees, code source) reste la', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('propriete exclusive de VIVIWORKS durant toute la periode de location/maintenance.', { x: 60, y, size: 8, font, color: black })
  y -= 12
  page.drawText('Transfert de propriete : Pour devenir proprietaire integral du site web et recuperer les', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('codes d\'acces serveur/domaine, le Client doit avoir regle la somme totale de 1 547 EUR HT', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('(correspondant au versement initial de 479 EUR additionne des 12 mensualites de 89 EUR).', { x: 60, y, size: 8, font, color: black })
  y -= 12
  page.drawText('Recuperation anticipee : Le Client peut demander le transfert de propriete avant le terme', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('des 12 mois en s\'acquittant du solde restant pour atteindre la somme totale de 1 547 EUR HT.', { x: 60, y, size: 8, font, color: black })
  y -= 12
  page.drawText('En cas d\'arret de paiement avant le reglement total, le Client perd l\'usage du site et ne', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('pourra pretendre a la recuperation des fichiers.', { x: 60, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 4 : DUREE ET RESILIATION', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('Le contrat est conclu pour une duree indeterminee avec une periode initiale d\'engagement', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('moral de 12 mois pour l\'acces a la propriete. Apres ces 12 mois, et si la totalite de la somme', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('(1 547 EUR) a ete versee, le Client peut resilier l\'abonnement par email ou lettre recommandee', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('avec un preavis de 30 jours.', { x: 50, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 5 : MAINTENANCE ET HEBERGEMENT', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('La maintenance comprend la mise a jour des plugins, la securite du site et les corrections de', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('bugs. Elle ne comprend pas l\'ajout de nouvelles fonctionnalites majeures qui feront l\'objet', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('d\'un devis separe.', { x: 50, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 6 : RESPONSABILITE', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('Le Prestataire s\'efforce d\'assurer une disponibilite du site a 99%. Il ne pourra etre tenu', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('responsable des interruptions dues aux hebergeurs tiers. Le Client est responsable du', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('contenu publie.', { x: 50, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 7 : PROTECTION DES DONNEES (RGPD)', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('Conformement au Reglement General sur la Protection des Donnees (RGPD), VIVIWORKS s\'engage a :', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('- Ne collecter que les donnees strictement necessaires a la gestion de la facturation et du', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('  support technique.', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('- Garantir au Client un droit d\'acces, de rectification et de suppression de ses donnees', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('  personnelles sur simple demande a l\'adresse du siege social.', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('- Assurer la securite des donnees stockees sur ses serveurs.', { x: 60, y, size: 8, font, color: black })
  y -= 10
  page.drawText('Le Client, en tant que proprietaire du contenu, est responsable de la conformite RGPD des', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('donnees collectees via son propre site web (formulaires de contact, cookies, etc.).', { x: 50, y, size: 8, font, color: black })

  y -= 18
  page.drawText('ARTICLE 8 : LITIGES', { x: 50, y, size: 10, font: fontBold, color: pink })
  y -= 14
  page.drawText('Les presentes CGV sont soumises au droit francais. En cas de litige, une solution amiable', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('sera recherchee avant toute action devant les tribunaux competents de Londres ou du', { x: 50, y, size: 8, font, color: black })
  y -= 10
  page.drawText('ressort du siege social du Prestataire.', { x: 50, y, size: 8, font, color: black })

  page.drawText('VIVIWORKS LTD UK - viviworks.ai', { x: 210, y: 30, size: 9, font, color: gray })

  return await pdfDoc.save()
}

export async function POST(request: Request) {
  try {
    const { email, clientNom, factureNumero } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email manquant' }, { status: 400 })
    }

    console.log('Generating CGV PDF...')
    const cgvPdf = await generateCGVPDF()
    const cgvBase64 = Buffer.from(cgvPdf).toString('base64')
    console.log('CGV PDF generated, size:', cgvPdf.length)

    console.log('Sending CGV email to:', email)
    const { error } = await resend.emails.send({
      from: 'Viviworks <facture@viviworks.ai>',
      to: [email],
      subject: `Conditions Generales de Vente - Viviworks`,
      html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(to right,#FF0671,#ff3d8f);padding:20px;text-align:center">
          <h1 style="color:white;margin:0">Viviworks</h1>
        </div>
        <div style="padding:30px;background:#f9f9f9">
          <h2 style="color:#333">Bonjour ${clientNom || 'cher client'},</h2>
          <p style="color:#666">Suite a votre facture N° ${factureNumero || ''}, veuillez trouver ci-joint nos Conditions Generales de Vente.</p>
          <div style="background:#fff3f8;padding:15px;border-radius:10px;margin:20px 0;border:1px solid #FF0671">
            <p style="color:#333;margin:0"><strong>📋 Document joint :</strong></p>
            <p style="margin:5px 0;color:#666">Conditions Generales de Vente (CGV) - PDF</p>
          </div>
          <p style="color:#666">Merci pour votre confiance !</p>
        </div>
        <div style="background:#333;padding:15px;text-align:center">
          <p style="color:#999;margin:0;font-size:12px">Viviworks - viviworks.ai</p>
        </div>
      </div>`,
      attachments: [
        {
          filename: 'CGV-Viviworks.pdf',
          content: cgvBase64
        }
      ]
    })

    if (error) {
      console.error('Erreur envoi CGV:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('CGV email sent successfully!')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
