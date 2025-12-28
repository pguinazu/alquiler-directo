// Data models aligned with n8n Firestore structure

export type UserRole = "tenant" | "landlord" | "admin"

export type PropertyType = "departamento" | "casa" | "ph" | "local" | "oficina"
export type OperationType = "alquiler" | "venta"
export type Currency = "USD" | "ARS"

// TenantUser model (tenantUsers collection in Firestore)
export interface TenantUser {
  id: string
  name: string
  userType: "tenant"
  email: string
  address: string
  phone: string
  // Search preferences
  propertyAddress?: string
  propertyTypeAndSize?: string
  pricePeriodCurrency?: string
  hasSalaryGuarantors?: boolean
  guarantorsMinSalary?: string
  guarantorsCUIL?: string[]
  tenantGuarantorsCreditHistory?: Array<{
    cuil: string
    status: string
    details: any
  }>
  petsQuantitySizeAndType?: string
  hasLandlordGuarantors?: string
  submittedAt: string
}

// LandlordUser model (landlordUsers collection in Firestore)
export interface LandlordUser {
  id: string
  name: string
  userType: "landlord"
  email: string
  address: string
  phone: string
  // Property details (currently stored in same document)
  propertyAddress: string
  propertyTypeAndSize: string
  pricePeriodCurrency: string
  hasSalaryGuarantors: boolean
  guarantorsMinSalary?: string
  petsQuantitySizeAndType?: string
  hasLandlordGuarantors: string
  submittedAt: string
}

// UI model for property listings
export interface PropertyListing {
  id: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  propertyAddress: string
  propertyTypeAndSize: string
  pricePeriodCurrency: string
  hasSalaryGuarantors: boolean
  guarantorsMinSalary?: string
  petsQuantitySizeAndType?: string
  hasLandlordGuarantors: string
  status: "published" | "paused"
  createdAt: string
  images?: string[]
  description?: string
}

export interface SearchFilters {
  operation?: OperationType
  currency?: Currency
  minPrice?: number
  maxPrice?: number
  zone?: string
  bedrooms?: number
  propertyType?: PropertyType
  hasSalaryGuarantors?: boolean
  petsAllowed?: boolean
}

export interface ParsedSearch {
  queryText: string
  filters: SearchFilters
  interpretation: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  rating: number
  reviewCount: number
  reviews: Review[]
}
