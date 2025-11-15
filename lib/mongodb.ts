import { MongoClient, Db, Collection } from 'mongodb'

// Vérifier que la variable d'environnement est présente
if (!process.env.MONGODB_URI) {
  throw new Error(
    '❌ MONGODB_URI manquant dans .env.local\n\n' +
    '📝 Créez le fichier .env.local à la racine avec :\n' +
    'MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/viviworks\n\n' +
    '📖 Voir GUIDE-MONGODB-ILLIMITE.md pour les instructions complètes'
  )
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // En développement, utiliser une variable globale pour préserver la connexion
  // entre les rechargements de module (hot reload)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // En production, créer une nouvelle connexion
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Fonction helper pour obtenir la base de données
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
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

export default clientPromise

