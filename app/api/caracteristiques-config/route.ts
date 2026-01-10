import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const CONFIG_KEY = 'viviworks-caracteristiques-config'

const DEFAULT_CONFIG = {
  options: [
    { id: "logo", label: "Création du logo" },
    { id: "agenda", label: "Agenda en ligne" },
    { id: "crm", label: "CRM" },
    { id: "visio", label: "RDV en visioconférence" },
    { id: "photos", label: "Reportage photos" },
    { id: "video", label: "Vidéo de présentation" },
    { id: "chatbot", label: "Chatbot IA" },
    { id: "newsletter", label: "Newsletter automatisée" },
    { id: "ecommerce", label: "Module e-commerce" },
    { id: "multilingue", label: "Site multilingue" },
  ],
  features: [
    { id: "responsive", label: "Responsive design", icon: "📱" },
    { id: "seo", label: "Référencement naturel", icon: "🔍" },
    { id: "ssl", label: "Navigation sécurisée", icon: "🔒" },
    { id: "stats", label: "Statistiques", icon: "📊" },
    { id: "hebergement", label: "Hébergement inclus", icon: "☁️" },
    { id: "support", label: "Support technique", icon: "🛠️" },
    { id: "miseajour", label: "Mises à jour illimitées", icon: "🔄" },
    { id: "formation", label: "Formation incluse", icon: "🎓" },
  ]
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

export async function GET() {
  try {
    const db = await getDb()
    const config = await db.collection('config').findOne({ key: CONFIG_KEY })
    
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
    console.error('Erreur GET caracteristiques config:', error)
    return NextResponse.json(DEFAULT_CONFIG, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  }
}

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
    console.error('Erreur POST caracteristiques config:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
