import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const CONFIG_KEY = 'viviworks-sidebar-order'

async function getDb() {
  if (!MONGODB_URI) {
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

// GET - Charger l'ordre de la sidebar
export async function GET() {
  let client = null
  try {
    if (!MONGODB_URI) {
      return NextResponse.json({ order: null }, {
        headers: { 'Cache-Control': 'no-store' }
      })
    }
    
    const connection = await getDb()
    client = connection.client
    const db = connection.db
    
    const config = await db.collection('config').findOne({ key: CONFIG_KEY })
    
    await client.close()
    
    if (config?.data?.order) {
      return NextResponse.json({ order: config.data.order }, {
        headers: { 'Cache-Control': 'no-store' }
      })
    }
    
    return NextResponse.json({ order: null }, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error: any) {
    console.error('Erreur GET sidebar order:', error?.message || error)
    if (client) {
      try { await client.close() } catch (e) {}
    }
    return NextResponse.json({ order: null }, {
      headers: { 'Cache-Control': 'no-store' }
    })
  }
}

// POST - Sauvegarder l'ordre de la sidebar
export async function POST(request: Request) {
  let client = null
  try {
    if (!MONGODB_URI) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
    }
    
    const { order } = await request.json()
    
    if (!order || !Array.isArray(order)) {
      return NextResponse.json({ error: 'Ordre invalide' }, { status: 400 })
    }
    
    const connection = await getDb()
    client = connection.client
    const db = connection.db
    
    await db.collection('config').updateOne(
      { key: CONFIG_KEY },
      { $set: { key: CONFIG_KEY, data: { order }, updatedAt: new Date() } },
      { upsert: true }
    )
    
    await client.close()
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erreur POST sidebar order:', error?.message || error)
    if (client) {
      try { await client.close() } catch (e) {}
    }
    return NextResponse.json({ error: error?.message || 'Erreur serveur' }, { status: 500 })
  }
}
