import { NextRequest, NextResponse } from 'next/server'
import { getDevisCollection, DevisData } from '@/lib/mongodb'

// GET /api/devis-mongodb/[id] - Récupérer un devis spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const collection = await getDevisCollection()
    const devis = await collection.findOne({ id })

    if (!devis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      )
    }

    // Retirer le _id MongoDB
    const { _id, ...devisData } = devis

    return NextResponse.json({ devis: devisData })
  } catch (error) {
    console.error('Erreur lors de la récupération du devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du devis' },
      { status: 500 }
    )
  }
}

// PUT /api/devis-mongodb/[id] - Mettre à jour un devis
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const devisData: Partial<DevisData> = body

    // Ajouter le timestamp de mise à jour
    devisData.updatedAt = new Date().toISOString()

    const collection = await getDevisCollection()
    
    const result = await collection.updateOne(
      { id },
      { $set: devisData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer le devis mis à jour
    const updatedDevis = await collection.findOne({ id })

    return NextResponse.json({ 
      success: true, 
      devis: updatedDevis,
      message: 'Devis mis à jour avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du devis' },
      { status: 500 }
    )
  }
}

// DELETE /api/devis-mongodb/[id] - Supprimer un devis
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const collection = await getDevisCollection()
    
    const result = await collection.deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Devis supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du devis' },
      { status: 500 }
    )
  }
}

