import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function POST(request: Request) {
  try {
    const { amount, clientEmail, clientNom, devisNumero, description } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Configuration Stripe manquante" }, { status: 500 })
    }

    // Créer une session Stripe Checkout pour prélèvement SEPA
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['sepa_debit'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Facture ${devisNumero}`,
              description: description || `Paiement pour ${clientNom}`,
            },
            unit_amount: Math.round(amount * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/devis`,
      customer_email: clientEmail,
      metadata: {
        devisNumero,
        clientNom,
        paymentType: 'sepa_debit'
      },
      payment_intent_data: {
        metadata: {
          devisNumero,
          clientNom,
          paymentType: 'sepa_debit'
        }
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur création session SEPA:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la création du prélèvement SEPA" },
      { status: 500 }
    )
  }
}
