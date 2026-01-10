import { MongoClient, Db, Collection } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const options = {
  maxPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI non configuré')
  }
  
  if (process.env.NODE_ENV === 'development') {
    // En développement, utiliser une variable globale pour préserver la connexion
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  } else {
    // En production, créer une nouvelle connexion à chaque appel
    if (!clientPromise) {
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
    return clientPromise
  }
}

// Fonction helper pour obtenir la base de données
export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db('viviworks')
}

// Fonction helper pour obtenir la collection des devis
export async function getDevisCollection(): Promise<Collection<DevisData>> {
  const db = await getDatabase()
  return db.collection<DevisData>('devis')
}

// Types pour les devis
export interface DevisData {
  _id?: string
  id: string
  numero: string
  date: string
  validite: string
  clientNom: string
  clientAdresse: string
  clientCodePostal: string
  clientVille: string
  clientTelephone: string
  clientEmail: string
  lines: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  notes: string
  signature?: string
  signatureDate?: string
  discount?: {
    id: string
    label: string
    value: number
    type: 'percentage' | 'fixed'
  }
  createdAt: string
  updatedAt: string
  status?: 'draft' | 'sent' | 'signed' | 'paid' | 'cancelled'
  totalHT?: number
}

export default getClientPromise

