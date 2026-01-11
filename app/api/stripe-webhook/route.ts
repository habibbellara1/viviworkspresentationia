import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })
const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'viviworksia@gmail.com'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    let event: Stripe.Event
    
    // Vérifier la signature si webhook secret configuré
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
      } catch (err) {
        console.error('Webhook signature verification failed')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
    } else {
      event = JSON.parse(body)
    }

    // Traiter l'événement de paiement réussi
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      const clientEmail = session.customer_email || 'Non renseigné'
      const clientNom = session.metadata?.clientNom || 'Client'
      const devisNumero = session.metadata?.devisNumero || 'N/A'
      const montant = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00'
      
      // Envoyer notification à l'admin
      await resend.emails.send({
        from: 'Viviworks <facture@viviworks.ai>',
        to: [ADMIN_EMAIL],
        subject: `💰 Nouveau paiement reçu - ${montant} EUR - ${clientNom}`,
        html: `
          <div style="font-family:Arial;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(to right,#22c55e,#16a34a);padding:20px;text-align:center">
              <h1 style="color:white;margin:0">💰 Paiement Reçu !</h1>
            </div>
            <div style="padding:30px;background:#f9f9f9">
              <h2 style="color:#22c55e">Nouveau paiement confirmé</h2>
              <div style="background:white;padding:20px;border-radius:10px;margin:20px 0;border-left:4px solid #22c55e">
                <p><strong>Client :</strong> ${clientNom}</p>
                <p><strong>Email :</strong> ${clientEmail}</p>
                <p><strong>Facture N° :</strong> ${devisNumero}</p>
                <p><strong>Montant :</strong> <span style="color:#22c55e;font-size:24px;font-weight:bold">${montant} EUR</span></p>
                <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                <p><strong>ID Stripe :</strong> ${session.id}</p>
              </div>
            </div>
            <div style="background:#333;padding:15px;text-align:center">
              <p style="color:#999;margin:0;font-size:12px">Viviworks - viviworks.ai</p>
            </div>
          </div>
        `
      })
      
      console.log('Notification de paiement envoyée à', ADMIN_EMAIL)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
