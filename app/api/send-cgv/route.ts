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
  page.drawText('Ce montant correspond a la main-d\'oeuvre pour la conception du site.', { x: 60, y, size: 9, font, color: black })
  y -= 16
  page.drawText('Abonnement mensuel : 89 EUR TTC / mois.', { x: 60, y, size: 9, font: fontBold, color: black })
  y -= 12
  page.drawText('Comprend l\'hebergement, le renouvellement du nom de domaine et la maintenance.', { x: 60, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 3 : DUREE D\'ENGAGEMENT ET PROPRIETE DU SITE', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Propriete intellectuelle : Le site reste la propriete de VIVIWORKS pendant 12 mois.', { x: 50, y, size: 9, font, color: black })
  y -= 14
  page.drawText('Transfert de propriete : Effectif apres le reglement des 12 premieres mensualites.', { x: 50, y, size: 9, font, color: black })
  y -= 14
  page.drawText('En cas d\'arret avant le 12eme mois, le Client perd l\'usage du site.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 4 : DUREE ET RESILIATION', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Contrat a duree indeterminee avec engagement initial de 12 mois.', { x: 50, y, size: 9, font, color: black })
  y -= 14
  page.drawText('Apres 12 mois, resiliation possible avec preavis de 30 jours.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 5 : MAINTENANCE ET HEBERGEMENT', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('La maintenance comprend les mises a jour, la securite et les corrections de bugs.', { x: 50, y, size: 9, font, color: black })
  y -= 14
  page.drawText('Les nouvelles fonctionnalites majeures feront l\'objet d\'un devis separe.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 6 : RESPONSABILITE', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('Le Prestataire assure une disponibilite de 99%. Non responsable des interruptions', { x: 50, y, size: 9, font, color: black })
  y -= 14
  page.drawText('dues aux hebergeurs tiers ou cas de force majeure.', { x: 50, y, size: 9, font, color: black })

  y -= 25
  page.drawText('ARTICLE 7 : LITIGES', { x: 50, y, size: 11, font: fontBold, color: pink })
  y -= 18
  page.drawText('CGV soumises au droit francais. Solution amiable recherchee avant action en justice.', { x: 50, y, size: 9, font, color: black })

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
