import type { TenantUser, LandlordUser, PropertyListing, Review } from "@/types"

export const mockTenants: TenantUser[] = [
  {
    id: "1",
    name: "Juan Pérez",
    userType: "tenant",
    email: "juan@example.com",
    address: "Palermo, CABA",
    phone: "+54 11 1234-5678",
    propertyAddress: "Palermo o Recoleta",
    propertyTypeAndSize: "2 ambientes",
    pricePeriodCurrency: "USD 500-800/mes",
    hasSalaryGuarantors: true,
    guarantorsMinSalary: "USD 2000",
    petsQuantitySizeAndType: "Sin mascotas",
    hasLandlordGuarantors: "libre disposición",
    submittedAt: new Date().toISOString(),
  },
]

export const mockLandlords: LandlordUser[] = [
  {
    id: "1",
    name: "María González",
    userType: "landlord",
    email: "maria@example.com",
    address: "Belgrano, CABA",
    phone: "+54 11 9876-5432",
    propertyAddress: "Av. Cabildo 2500, Belgrano",
    propertyTypeAndSize: "Departamento 3 ambientes, 65m²",
    pricePeriodCurrency: "USD 700/mes",
    hasSalaryGuarantors: true,
    guarantorsMinSalary: "USD 2100",
    petsQuantitySizeAndType: "Acepta mascotas pequeñas",
    hasLandlordGuarantors: "libre disposición",
    submittedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    userType: "landlord",
    email: "carlos@example.com",
    address: "Palermo, CABA",
    phone: "+54 11 5555-1234",
    propertyAddress: "Av. Santa Fe 3800, Palermo",
    propertyTypeAndSize: "Departamento 2 ambientes, 45m²",
    pricePeriodCurrency: "USD 600/mes",
    hasSalaryGuarantors: true,
    guarantorsMinSalary: "USD 1800",
    petsQuantitySizeAndType: "No acepta mascotas",
    hasLandlordGuarantors: "bien de familia",
    submittedAt: new Date().toISOString(),
  },
]

export const mockListings: PropertyListing[] = mockLandlords.map((landlord) => ({
  id: landlord.id,
  ownerName: landlord.name,
  ownerEmail: landlord.email,
  ownerPhone: landlord.phone,
  propertyAddress: landlord.propertyAddress,
  propertyTypeAndSize: landlord.propertyTypeAndSize,
  pricePeriodCurrency: landlord.pricePeriodCurrency,
  hasSalaryGuarantors: landlord.hasSalaryGuarantors,
  guarantorsMinSalary: landlord.guarantorsMinSalary,
  petsQuantitySizeAndType: landlord.petsQuantitySizeAndType,
  hasLandlordGuarantors: landlord.hasLandlordGuarantors,
  status: "published",
  createdAt: landlord.submittedAt,
  images: [`/placeholder.svg?height=400&width=600&query=modern+apartment+interior`],
  description: "Hermoso departamento luminoso con excelente ubicación.",
}))

export const mockReviews: Review[] = [
  {
    id: "1",
    userId: "1",
    userName: "Ana López",
    rating: 5,
    comment: "Excelente inquilino, muy responsable con los pagos.",
    date: "2024-01-15",
  },
  {
    id: "2",
    userId: "2",
    userName: "Pedro Martínez",
    rating: 4,
    comment: "Buen trato, recomendado.",
    date: "2024-02-20",
  },
]

// Mapper function: LandlordUser -> PropertyListing
export function mapLandlordToListing(landlord: LandlordUser): PropertyListing {
  return {
    id: landlord.id,
    ownerName: landlord.name,
    ownerEmail: landlord.email,
    ownerPhone: landlord.phone,
    propertyAddress: landlord.propertyAddress,
    propertyTypeAndSize: landlord.propertyTypeAndSize,
    pricePeriodCurrency: landlord.pricePeriodCurrency,
    hasSalaryGuarantors: landlord.hasSalaryGuarantors,
    guarantorsMinSalary: landlord.guarantorsMinSalary,
    petsQuantitySizeAndType: landlord.petsQuantitySizeAndType,
    hasLandlordGuarantors: landlord.hasLandlordGuarantors,
    status: "published",
    createdAt: landlord.submittedAt,
  }
}
