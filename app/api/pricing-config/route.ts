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
    if (!MONGODB_URI) {
      console.error('MONGODB_URI non défini')
      return NextResponse.json(DEFAULT_CONFIG, {
        headers: { 'Cache-Control': 'no-store' }
      })
    }
    
    const connection = await getDb()
    client = connection.client
    const db = connection.db
    
    const config = await db.collection('config').findOne({ key: CONFIG_KEY })
    
    await client.close()
    
    if (config?.data) {
      return NextResponse.json(config.data, {
        headers: { 'Cache-Control': 'no-store' }
      })
    }
    
    return NextResponse.json(DEFAULT_CONFIG, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error: any) {
    console.error('Erreur GET pricing config:', error?.message || error)
    if (client) {
      try { await client.close() } catch (e) {}
    }
    return NextResponse.json(DEFAULT_CONFIG, {
      headers: { 'Cache-Control': 'no-store' }
    })
  }
}

// POST - Sauvegarder la configuration
export async function POST(request: Request) {
  let client = null
  try {
    if (!MONGODB_URI) {
      console.error('MONGODB_URI non défini')
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
    }
    
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
  } catch (error: any) {
    console.error('Erreur POST pricing config:', error?.message || error)
    if (client) {
      try { await client.close() } catch (e) {}
    }
    return NextResponse.json({ error: error?.message || 'Erreur serveur' }, { status: 500 })
  }
}
