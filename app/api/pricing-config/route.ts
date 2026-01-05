import { NextResponse } from 'next/server'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const CONFIG_KEY = 'viviworks-pricing-config'

// GET - Charger la configuration
export async function GET() {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return NextResponse.json({ error: 'Configuration Upstash manquante' }, { status: 500 })
    }

    const response = await fetch(`${UPSTASH_URL}/get/${CONFIG_KEY}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
      cache: 'no-store'
    })

    const data = await response.json()
    
    if (data.result) {
      const config = JSON.parse(data.result)
      return NextResponse.json(config)
    }
    
    return NextResponse.json(null)
  } catch (error) {
    console.error('Erreur GET pricing config:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Sauvegarder la configuration
export async function POST(request: Request) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return NextResponse.json({ error: 'Configuration Upstash manquante' }, { status: 500 })
    }

    const config = await request.json()
    
    const response = await fetch(`${UPSTASH_URL}/set/${CONFIG_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(config))
    })

    const data = await response.json()
    
    if (data.result === 'OK') {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 })
  } catch (error) {
    console.error('Erreur POST pricing config:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
