import { NextRequest, NextResponse } from 'next/server'
import { getDevisCollection, DevisData } from '@/lib/mongodb'

// GET /api/devis-mongodb - Récupérer tous les devis
export async function GET(req: NextRequest) {
  try {
    const collection = await getDevisCollection()
    
    // Récupérer tous les devis, triés par date de création (plus récent d'abord)
    const devis = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Convertir _id en string et le retirer si nécessaire
    const devisFormatted = devis.map(d => ({
      ...d,
      _id: undefined // Ne pas envoyer le _id MongoDB au client
    }))

    return NextResponse.json({ devis: devisFormatted })
  } catch (error) {
    console.error('Erreur lors de la récupération des devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des devis' },
      { status: 500 }
    )
  }
}

// POST /api/devis-mongodb - Créer ou mettre à jour un devis
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const devisData: DevisData = body

    // Validation basique
    if (!devisData.numero || !devisData.clientNom) {
      return NextResponse.json(
        { error: 'Numéro de devis et nom du client requis' },
        { status: 400 }
      )
    }

    // Générer un ID unique si pas présent
    if (!devisData.id) {
      devisData.id = `devis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // Calculer le total HT
    const subtotalHT = devisData.lines.reduce((sum, line) => sum + line.total, 0)
    let totalHT = subtotalHT
    
    if (devisData.discount && devisData.discount.value > 0) {
      if (devisData.discount.type === 'percentage') {
        totalHT = subtotalHT - (subtotalHT * devisData.discount.value) / 100
      } else {
        totalHT = subtotalHT - devisData.discount.value
      }
    }
    
    devisData.totalHT = totalHT

    // Ajouter les timestamps
    const now = new Date().toISOString()
    if (!devisData.createdAt) {
      devisData.createdAt = now
    }
    devisData.updatedAt = now

    // Status par défaut
    if (!devisData.status) {
      devisData.status = 'draft'
    }

    const collection = await getDevisCollection()

    // Vérifier si le devis existe déjà (par ID)
    const existingDevis = await collection.findOne({ id: devisData.id })

    if (existingDevis) {
      // Mettre à jour le devis existant
      await collection.updateOne(
        { id: devisData.id },
        { $set: devisData }
      )
    } else {
      // Insérer un nouveau devis
      await collection.insertOne(devisData as any)
    }

    return NextResponse.json({ 
      success: true, 
      devis: devisData,
      message: 'Devis sauvegardé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du devis' },
      { status: 500 }
    )
  }
}

// DELETE /api/devis-mongodb - Supprimer tous les devis (pour développement uniquement)
export async function DELETE(req: NextRequest) {
  try {
    const collection = await getDevisCollection()
    
    // Supprimer tous les documents
    const result = await collection.deleteMany({})

    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} devis supprimés`
    })
  } catch (error) {
    console.error('Erreur lors de la suppression des devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des devis' },
      { status: 500 }
    )
  }
}

