import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function POST(request: Request) {
  try {
    const { amount, clientEmail, clientNom, devisNumero, description } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }

    // Créer une session de paiement Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Facture ${devisNumero || 'Viviworks'}`,
              description: description || 'Paiement facture Viviworks',
            },
            unit_amount: Math.round(amount * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://presentationviviworks.netlify.app'}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://presentationviviworks.netlify.app'}/`,
      customer_email: clientEmail || undefined,
      metadata: {
        devisNumero: devisNumero || '',
        clientNom: clientNom || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erreur Stripe:', error)
    return NextResponse.json({ error: error.message || 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
