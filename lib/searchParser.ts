import type { SearchFilters, ParsedSearch } from "@/types"

/**
 * Heuristic parser for free-text property search
 * Extracts filters from natural language queries
 */
export function parseSearchQuery(queryText: string): ParsedSearch {
  const lower = queryText.toLowerCase()
  const filters: SearchFilters = {}
  const interpretations: string[] = []

  // Parse operation type
  if (lower.includes("alquiler") || lower.includes("alquilar") || lower.includes("rentar")) {
    filters.operation = "alquiler"
    interpretations.push("Búsqueda de alquiler")
  } else if (lower.includes("venta") || lower.includes("comprar") || lower.includes("compra")) {
    filters.operation = "venta"
    interpretations.push("Búsqueda de venta")
  }

  // Parse currency
  if (lower.includes("dolar") || lower.includes("usd") || lower.includes("u$s")) {
    filters.currency = "USD"
    interpretations.push("Precio en dólares")
  } else if (lower.includes("peso") || lower.includes("ars") || lower.includes("$")) {
    filters.currency = "ARS"
    interpretations.push("Precio en pesos")
  }

  // Parse price range
  const priceMatch = lower.match(/(\d+)\s*(?:a|hasta|-)\s*(\d+)/)
  if (priceMatch) {
    filters.minPrice = Number.parseInt(priceMatch[1])
    filters.maxPrice = Number.parseInt(priceMatch[2])
    interpretations.push(`Precio entre ${filters.minPrice} y ${filters.maxPrice}`)
  } else {
    const singlePriceMatch = lower.match(/(?:hasta|máximo|max)\s*(\d+)/)
    if (singlePriceMatch) {
      filters.maxPrice = Number.parseInt(singlePriceMatch[1])
      interpretations.push(`Precio hasta ${filters.maxPrice}`)
    }
  }

  // Parse neighborhoods/zones (Buenos Aires specific)
  const zones = [
    "palermo",
    "recoleta",
    "belgrano",
    "caballito",
    "villa crespo",
    "almagro",
    "barrio norte",
    "colegiales",
    "nuñez",
    "saavedra",
    "villa urquiza",
    "puerto madero",
    "san telmo",
    "microcentro",
  ]

  const foundZone = zones.find((zone) => lower.includes(zone))
  if (foundZone) {
    filters.zone = foundZone
    interpretations.push(`Zona: ${foundZone.charAt(0).toUpperCase() + foundZone.slice(1)}`)
  }

  // Parse bedrooms (ambientes)
  const bedroomMatch = lower.match(/(\d+)\s*(?:ambiente|ambientes|amb|dormitorio|dormitorios)/)
  if (bedroomMatch) {
    filters.bedrooms = Number.parseInt(bedroomMatch[1])
    interpretations.push(`${filters.bedrooms} ambientes`)
  }

  // Parse property type
  if (lower.includes("departamento") || lower.includes("depto")) {
    filters.propertyType = "departamento"
    interpretations.push("Tipo: Departamento")
  } else if (lower.includes("casa")) {
    filters.propertyType = "casa"
    interpretations.push("Tipo: Casa")
  } else if (lower.includes("ph")) {
    filters.propertyType = "ph"
    interpretations.push("Tipo: PH")
  } else if (lower.includes("local")) {
    filters.propertyType = "local"
    interpretations.push("Tipo: Local comercial")
  } else if (lower.includes("oficina")) {
    filters.propertyType = "oficina"
    interpretations.push("Tipo: Oficina")
  }

  // Parse requirements
  if (lower.includes("garantia") || lower.includes("garante")) {
    filters.hasSalaryGuarantors = lower.includes("sin") ? false : true
    interpretations.push(filters.hasSalaryGuarantors ? "Con garantía" : "Sin garantía")
  }

  if (lower.includes("mascota") || lower.includes("perro") || lower.includes("gato")) {
    filters.petsAllowed = !lower.includes("sin")
    interpretations.push(filters.petsAllowed ? "Acepta mascotas" : "Sin mascotas")
  }

  const interpretation = interpretations.length > 0 ? interpretations.join(" • ") : "Búsqueda general"

  return {
    queryText,
    filters,
    interpretation,
  }
}
