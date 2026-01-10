import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const CONFIG_KEY = 'viviworks-pricing-config'

// Configuration par défaut
const DEFAULT_CONFIG = {
  prixSiteVitrine: 1500,
  prixEcommerce: 3000,
  prixApplication: 5000,
  tauxHoraire: 75,
  remisePartenaire: 10
}

let client: MongoClient | null = null

async function getDb() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI non configuré')
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
  }
  return client.db('viviworks')
}

// GET - Charger la configuration
export async function GET() {
  try {
    const db = await getDb()
    const config = await db.collection('config').findOne({ key: CONFIG_KEY })
    
    if (config?.data) {
      return NextResponse.json(config.data)
    }
    
    return NextResponse.json(DEFAULT_CONFIG)
  } catch (error) {
    console.error('Erreur GET pricing config:', error)
    return NextResponse.json(DEFAULT_CONFIG)
  }
}

// POST - Sauvegarder la configuration
export async function POST(request: Request) {
  try {
    const configData = await request.json()
    const db = await getDb()
    
    await db.collection('config').updateOne(
      { key: CONFIG_KEY },
      { $set: { key: CONFIG_KEY, data: configData, updatedAt: new Date() } },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur POST pricing config:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
