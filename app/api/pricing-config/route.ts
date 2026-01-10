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

async function getDb() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI non configuré')
    throw new Error('MONGODB_URI non configuré')
  }
  
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  })
  
  await client.connect()
  return { client, db: client.db('viviworks') }
}

// GET - Charger la configuration
export async function GET() {
  let client = null
  try {
    const connection = await getDb()
    client = connection.client
    const db = connection.db
    
    const config = await db.collection('config').findOne({ key: CONFIG_KEY })
    
    await client.close()
    
    if (config?.data) {
      return NextResponse.json(config.data, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
    }
    
    return NextResponse.json(DEFAULT_CONFIG, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Erreur GET pricing config:', error)
    if (client) await client.close()
    return NextResponse.json(DEFAULT_CONFIG, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  }
}

// POST - Sauvegarder la configuration
export async function POST(request: Request) {
  let client = null
  try {
    const configData = await request.json()
    const connection = await getDb()
    client = connection.client
    const db = connection.db
    
    await db.collection('config').updateOne(
      { key: CONFIG_KEY },
      { $set: { key: CONFIG_KEY, data: configData, updatedAt: new Date() } },
      { upsert: true }
    )
    
    await client.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur POST pricing config:', error)
    if (client) await client.close()
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
