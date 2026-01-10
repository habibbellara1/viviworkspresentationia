import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const resend = new Resend(process.env.RESEND_API_KEY)

interface DevisLine {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface DevisData {
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
  total: number
  signature: string
}

async function generatePDF(data: DevisData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const { height } = page.getSize()
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const pink = rgb(1, 0.024, 0.443) // #FF0671
  const black = rgb(0, 0, 0)
  const gray = rgb(0.4, 0.4, 0.4)
  
  let y = height - 50

  // Header - Titre
  page.drawText('FACTURE', {
    x: 50,
    y,
    size: 28,
    font: fontBold,
    color: pink,
  })
  
  y -= 25
  page.drawText(`N° ${data.numero}`, {
    x: 50,
    y,
    size: 12,
    font: font,
    color: gray,
  })

  // Date et validité à droite
  page.drawText(`Date: ${data.date}`, {
    x: 400,
    y: height - 50,
    size: 10,
    font: font,
    color: black,
  })
  page.drawText(`Validite: ${data.validite}`, {
    x: 400,
    y: height - 65,
    size: 10,
    font: font,
    color: black,
  })

  // Ligne de séparation
  y -= 30
  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 2,
    color: pink,
  })

  // Informations client
  y -= 30
  page.drawText('CLIENT', {
    x: 50,
    y,
    size: 12,
    font: fontBold,
    color: pink,
  })
  
  y -= 20
  page.drawText(data.clientNom || 'Non renseigne', {
    x: 50,
    y,
    size: 11,
    font: fontBold,
    color: black,
  })
  
  y -= 15
  if (data.clientAdresse) {
    page.drawText(data.clientAdresse, { x: 50, y, size: 10, font, color: black })
    y -= 15
  }
  if (data.clientCodePostal || data.clientVille) {
    page.drawText(`${data.clientCodePostal} ${data.clientVille}`, { x: 50, y, size: 10, font, color: black })
    y -= 15
  }
  if (data.clientTelephone) {
    page.drawText(`Tel: ${data.clientTelephone}`, { x: 50, y, size: 10, font, color: black })
    y -= 15
  }
  if (data.clientEmail) {
    page.drawText(`Email: ${data.clientEmail}`, { x: 50, y, size: 10, font, color: black })
    y -= 15
  }

  // Tableau des prestations
  y -= 20
  page.drawText('PRESTATIONS', {
    x: 50,
    y,
    size: 12,
    font: fontBold,
    color: pink,
  })

  // En-tête du tableau
  y -= 25
  const tableTop = y
  page.drawRectangle({
    x: 50,
    y: y - 5,
    width: 495,
    height: 20,
    color: pink,
  })
  
  page.drawText('Description', { x: 55, y, size: 9, font: fontBold, color: rgb(1, 1, 1) })
  page.drawText('Qte', { x: 350, y, size: 9, font: fontBold, color: rgb(1, 1, 1) })
  page.drawText('Prix unit.', { x: 400, y, size: 9, font: fontBold, color: rgb(1, 1, 1) })
  page.drawText('Total HT', { x: 480, y, size: 9, font: fontBold, color: rgb(1, 1, 1) })

  // Lignes du tableau
  y -= 25
  for (const line of data.lines) {
    if (y < 200) break // Éviter de dépasser la page
    
    // Tronquer la description si trop longue
    const desc = line.description.length > 45 ? line.description.substring(0, 45) + '...' : line.description
    
    page.drawText(desc || '-', { x: 55, y, size: 9, font, color: black })
    page.drawText(String(line.quantity), { x: 355, y, size: 9, font, color: black })
    page.drawText(`${line.unitPrice.toFixed(2)} EUR`, { x: 395, y, size: 9, font, color: black })
    page.drawText(`${line.total.toFixed(2)} EUR`, { x: 475, y, size: 9, font, color: black })
    
    y -= 18
    // Ligne de séparation
    page.drawLine({
      start: { x: 50, y: y + 5 },
      end: { x: 545, y: y + 5 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
  }

  // Total
  y -= 20
  page.drawRectangle({
    x: 380,
    y: y - 5,
    width: 165,
    height: 25,
    color: rgb(0.95, 0.95, 0.95),
  })
  page.drawText('TOTAL HT:', { x: 390, y, size: 11, font: fontBold, color: black })
  page.drawText(`${data.total.toFixed(2)} EUR`, { x: 480, y, size: 11, font: fontBold, color: pink })

  // Notes
  if (data.notes) {
    y -= 40
    page.drawText('Notes:', { x: 50, y, size: 10, font: fontBold, color: gray })
    y -= 15
    page.drawText(data.notes.substring(0, 80), { x: 50, y, size: 9, font, color: gray })
  }

  // Signature
  y -= 50
  page.drawText('SIGNATURE ELECTRONIQUE', {
    x: 50,
    y,
    size: 12,
    font: fontBold,
    color: pink,
  })
  
  y -= 20
  page.drawText(`Signe le: ${new Date().toLocaleString('fr-FR')}`, {
    x: 50,
    y,
    size: 10,
    font,
    color: black,
  })

  // Ajouter l'image de signature
  if (data.signature) {
    try {
      const signatureData = data.signature.replace(/^data:image\/png;base64,/, '')
      const signatureImage = await pdfDoc.embedPng(Buffer.from(signatureData, 'base64'))
      const signatureDims = signatureImage.scale(0.5)
      
      y -= 10
      page.drawImage(signatureImage, {
        x: 50,
        y: y - signatureDims.height,
        width: signatureDims.width,
        height: signatureDims.height,
      })
      
      y -= signatureDims.height + 10
    } catch (e) {
      console.error('Erreur signature image:', e)
    }
  }

  // Badge "Document signé"
  y -= 20
  page.drawText('Document signe electroniquement', {
    x: 50,
    y,
    size: 10,
    font: fontBold,
    color: rgb(0, 0.6, 0),
  })

  // Footer
  page.drawText('Viviworks - viviworks.ai', {
    x: 230,
    y: 30,
    size: 9,
    font,
    color: gray,
  })

  return await pdfDoc.save()
}

export async function POST(request: Request) {
  try {
    const { email, devisData, signature } = await request.json()

    if (!email || !devisData || !signature) {
      return NextResponse.json({ error: 'Donnees manquantes' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY non configuree')
      return NextResponse.json({ error: 'Service email non configure' }, { status: 500 })
    }

    // Générer le PDF
    const pdfBytes = await generatePDF({
      ...devisData,
      signature
    })
    
    // Convertir en base64 pour l'envoi
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64')

    // Envoyer l'email avec le PDF en pièce jointe
    const { data, error } = await resend.emails.send({
      from: 'Viviworks <facture@viviworks.ai>',
      to: email,
      subject: `Votre facture signee N° ${devisData.numero} - Viviworks`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #FF0671, #ff3d8f); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Viviworks</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Bonjour ${devisData.clientNom || 'cher client'},</h2>
            <p style="color: #666; line-height: 1.6;">
              Veuillez trouver ci-joint votre facture signee electroniquement.
            </p>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Facture N°:</strong> ${devisData.numero}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${devisData.date}</p>
              <p style="margin: 5px 0;"><strong>Montant total HT:</strong> <span style="color: #FF0671; font-weight: bold;">${devisData.total.toFixed(2)} EUR</span></p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Merci pour votre confiance !
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Ce document a ete signe electroniquement le ${new Date().toLocaleString('fr-FR')}.
            </p>
          </div>
          <div style="background: #333; padding: 15px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              Viviworks - viviworks.ai
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `facture-${devisData.numero}.pdf`,
          content: pdfBase64,
        }
      ]
    })

    if (error) {
      console.error('Erreur Resend:', error)
      
      if (error.message?.includes('only send testing emails')) {
        return NextResponse.json({ 
          error: 'Mode test : vous ne pouvez envoyer qu\'a habibhabibhabib@erzi.me. Verifiez un domaine sur resend.com/domains pour envoyer a d\'autres adresses.' 
        }, { status: 400 })
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Facture PDF envoyee a ${email}, ID: ${data?.id}`)

    return NextResponse.json({ 
      success: true, 
      message: `Facture envoyee a ${email}`,
      emailId: data?.id
    })
  } catch (error) {
    console.error('Erreur envoi email:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
