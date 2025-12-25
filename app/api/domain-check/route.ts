import { NextRequest, NextResponse } from "next/server"

// Prix OVH actuels (mis à jour régulièrement)
const OVH_PRICES: Record<string, { create: number; renew: number }> = {
  ".fr": { create: 6.99, renew: 9.99 },
  ".com": { create: 9.99, renew: 12.99 },
  ".net": { create: 12.99, renew: 14.99 },
  ".org": { create: 12.99, renew: 14.99 },
  ".eu": { create: 6.99, renew: 8.99 },
  ".io": { create: 39.99, renew: 49.99 },
  ".co": { create: 24.99, renew: 29.99 },
  ".info": { create: 4.99, renew: 14.99 },
  ".biz": { create: 12.99, renew: 16.99 },
  ".be": { create: 7.99, renew: 9.99 },
}

interface DomainCheckResult {
  domain: string
  available: boolean
  price: number
  renewPrice: number
  error?: string
}

async function checkOVHDomain(domain: string): Promise<DomainCheckResult> {
  const extension = "." + domain.split(".").pop()
  const prices = OVH_PRICES[extension] || { create: 19.99, renew: 19.99 }

  try {
    // API OVH publique pour vérifier la disponibilité
    const response = await fetch(
      `https://api.ovh.com/1.0/domain/data/claimNotice?domain=${encodeURIComponent(domain)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // Si l'API retourne une erreur 404, le domaine n'existe pas dans leur système
    // On utilise une autre méthode
    if (!response.ok) {
      // Essayer l'API de disponibilité
      const availResponse = await fetch(
        `https://api.ovh.com/1.0/domain/availableServices?domain=${encodeURIComponent(domain)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (availResponse.ok) {
        const data = await availResponse.json()
        return {
          domain,
          available: Array.isArray(data) && data.length > 0,
          price: prices.create,
          renewPrice: prices.renew,
        }
      }
    }

    // Méthode alternative: vérifier via DNS
    // Si le domaine a des enregistrements DNS, il est probablement pris
    const dnsCheck = await checkDNS(domain)
    
    return {
      domain,
      available: !dnsCheck,
      price: prices.create,
      renewPrice: prices.renew,
    }
  } catch (error) {
    // En cas d'erreur, utiliser la vérification DNS
    const dnsCheck = await checkDNS(domain)
    return {
      domain,
      available: !dnsCheck,
      price: prices.create,
      renewPrice: prices.renew,
    }
  }
}

async function checkDNS(domain: string): Promise<boolean> {
  try {
    // Utiliser l'API DNS de Google pour vérifier si le domaine existe
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`
    )
    
    if (response.ok) {
      const data = await response.json()
      // Si Status est 0 (NOERROR) et qu'il y a des réponses, le domaine existe
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        return true
      }
      // Si Status est 3 (NXDOMAIN), le domaine n'existe pas
      if (data.Status === 3) {
        return false
      }
    }
    
    // Par défaut, considérer comme potentiellement disponible
    return false
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const domain = searchParams.get("domain")

  if (!domain) {
    return NextResponse.json({ error: "Domain parameter is required" }, { status: 400 })
  }

  try {
    const result = await checkOVHDomain(domain)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check domain availability" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domains } = body

    if (!domains || !Array.isArray(domains)) {
      return NextResponse.json(
        { error: "Domains array is required" },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      domains.map((domain: string) => checkOVHDomain(domain))
    )

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check domains" },
      { status: 500 }
    )
  }
}
