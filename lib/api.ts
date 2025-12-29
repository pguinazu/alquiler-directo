import type { TenantUser, LandlordUser, PropertyListing, UserRole, SearchFilters } from "@/types"
import { getIdTokenSafe, getAuthUid, signinEmailPassword } from "@/lib/auth"

/**
 * API Layer - Integrated with n8n webhooks
 *
 * Expected n8n webhook paths (POST):
 * - /api/login
 * - /api/listings/search
 * - /api/listings/upsert
 * - /api/users/tenant/create
 * - /api/users/owner/create
 */

const STORAGE_KEYS = {
  USER: "real-estate-user",
  ROLE: "real-estate-role",
  LISTINGS: "real-estate-listings", // legacy fallback (unused when n8n is enabled)
}

// ---------- n8n client ----------
async function n8nPost<T>(path: string, body: any): Promise<T> {
  console.log("[v0] n8nPost called with path:", path)

  const token = await getIdTokenSafe()
  console.log("[v0] Token obtained:", token ? "YES" : "NO")

  if (!token) throw new Error("UNAUTHORIZED")

  const authUid = await getAuthUid()
  console.log("[v0] Auth UID:", authUid)

  const bodyWithAuth = {
    ...body,
    authUid,
  }

  console.log("[v0] Making fetch to /api/n8n" + path)

  const res = await fetch(`/api/n8n${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyWithAuth),
    cache: "no-store",
  })

  console.log("[v0] Response status:", res.status)

  const data = await res.json().catch(() => null)
  console.log("[v0] Response data:", data)

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`
    console.log("[v0] n8nPost error:", msg, "data:", data)
    throw new Error(msg)
  }

  return data as T
}

// ---------- helpers ----------
function toYesNo(value: boolean | string | undefined | null): "Sí" | "No" | "" {
  if (value === true) return "Sí"
  if (value === false) return "No"
  const s = String(value ?? "")
    .trim()
    .toLowerCase()
  if (!s) return ""
  if (["si", "sí", "s", "true", "1"].includes(s)) return "Sí"
  if (["no", "n", "false", "0"].includes(s)) return "No"
  return ""
}

function toBool(value: any): boolean {
  if (typeof value === "boolean") return value
  const s = String(value ?? "")
    .trim()
    .toLowerCase()
  return ["si", "sí", "s", "true", "1"].includes(s)
}

function normalizeStatus(value: any): "published" | "paused" {
  const s = String(value ?? "")
    .trim()
    .toLowerCase()
  if (s === "paused") return "paused"
  return "published"
}

function mapN8nListingToUI(raw: any): PropertyListing {
  console.log("[v0] mapN8nListingToUI raw images:", raw?.images, "type:", typeof raw?.images)

  let images: string[] | undefined
  if (raw?.images) {
    if (Array.isArray(raw.images)) {
      images = raw.images
    } else if (typeof raw.images === "string" && raw.images.trim()) {
      images = raw.images
        .split(",")
        .map((url: string) => url.trim())
        .filter(Boolean)
    }
  }

  console.log("[v0] mapN8nListingToUI parsed images:", images)

  return {
    id: String(raw?.id ?? raw?.ownerId ?? ""),
    ownerName: String(raw?.ownerName ?? raw?.name ?? ""),
    ownerEmail: String(raw?.ownerEmail ?? raw?.email ?? ""),
    ownerPhone: String(raw?.ownerPhone ?? raw?.phone ?? ""),
    propertyAddress: String(raw?.propertyAddress ?? ""),
    propertyTypeAndSize: String(raw?.propertyTypeAndSize ?? ""),
    pricePeriodCurrency: String(raw?.pricePeriodCurrency ?? ""),
    hasSalaryGuarantors: toBool(raw?.hasSalaryGuarantors),
    guarantorsMinSalary: raw?.guarantorsMinSalary ? String(raw.guarantorsMinSalary) : undefined,
    petsQuantitySizeAndType: raw?.petsQuantitySizeAndType ? String(raw.petsQuantitySizeAndType) : undefined,
    hasLandlordGuarantors: String(raw?.hasLandlordGuarantors ?? ""),
    status: normalizeStatus(raw?.listingStatus ?? raw?.status),
    createdAt: String(raw?.createdAt ?? raw?.submittedAt ?? raw?.updatedAt ?? new Date().toISOString()),
    images,
    description: raw?.description ? String(raw.description) : undefined,
  }
}

// ---------- auth ----------
export async function loginWithRole(
  email: string,
  password: string,
  role: UserRole,
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    await signinEmailPassword(email, password)

    const r = await n8nPost<{ ok: boolean; user?: any; error?: string }>("/api/login", {
      email,
      password,
      role,
    })

    if (!r.ok || !r.user) {
      return { success: false, error: r.error || "LOGIN_FAILED" }
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(r.user))
    localStorage.setItem(STORAGE_KEYS.ROLE, role)

    return { success: true, user: r.user }
  } catch (e: any) {
    if (e?.code === "auth/wrong-password" || e?.code === "auth/invalid-credential") {
      return { success: false, error: "WRONG_PASSWORD" }
    }
    return { success: false, error: e?.message || "LOGIN_FAILED" }
  }
}

// ---------- create users ----------
export async function createTenantUser(
  payload: Omit<TenantUser, "id" | "submittedAt">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const body = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,

      propertyAddress: payload.propertyAddress || "",
      propertyTypeAndSize: payload.propertyTypeAndSize || "",
      pricePeriodCurrency: payload.pricePeriodCurrency || "",

      hasSalaryGuarantors: toYesNo(payload.hasSalaryGuarantors),
      guarantorsMinSalary: payload.guarantorsMinSalary || "",
      guarantorsCUIL: Array.isArray(payload.guarantorsCUIL) ? payload.guarantorsCUIL.join(", ") : "",

      petsQuantitySizeAndType: payload.petsQuantitySizeAndType || "",
      hasLandlordGuarantors: payload.hasLandlordGuarantors || "",
    }

    const r = await n8nPost<any>("/api/users/tenant/create", body)

    if (r?.ok === false) return { success: false, error: r?.tenant?.error || r?.error || "CREATE_TENANT_FAILED" }

    const id = String(r?.tenant?.id ?? r?.tenantId ?? r?.id ?? "")
    return { success: true, id: id || undefined }
  } catch (e: any) {
    return { success: false, error: e?.message || "CREATE_TENANT_FAILED" }
  }
}

export async function createOwnerUser(
  payload: Omit<LandlordUser, "id" | "submittedAt">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const body = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
    }

    const r = await n8nPost<any>("/api/users/owner/create", body)

    if (r?.ok === false) return { success: false, error: r?.owner?.error || r?.error || "CREATE_OWNER_FAILED" }

    const id = String(r?.owner?.id ?? r?.ownerId ?? r?.id ?? "")
    return { success: true, id: id || undefined }
  } catch (e: any) {
    return { success: false, error: e?.message || "CREATE_OWNER_FAILED" }
  }
}

// ---------- listings ----------
export async function createListing(
  payload: Omit<PropertyListing, "id" | "createdAt">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const current = getCurrentUser()
    const ownerEmail = String(current?.email ?? payload.ownerEmail ?? "")
      .trim()
      .toLowerCase()
    if (!ownerEmail) return { success: false, error: "NOT_LOGGED_IN" }

    const r = await n8nPost<any>("/api/listings/upsert", {
      owner: {
        name: String(current?.name ?? payload.ownerName ?? ""),
        email: ownerEmail,
        phone: String(current?.phone ?? payload.ownerPhone ?? ""),
        address: String(current?.address ?? ""),
      },
      listing: {
        propertyAddress: payload.propertyAddress,
        propertyTypeAndSize: payload.propertyTypeAndSize,
        pricePeriodCurrency: payload.pricePeriodCurrency,
        hasSalaryGuarantors: toYesNo(payload.hasSalaryGuarantors),
        guarantorsMinSalary: payload.guarantorsMinSalary || "",
        petsQuantitySizeAndType: payload.petsQuantitySizeAndType || "",
        hasLandlordGuarantors: payload.hasLandlordGuarantors,
        listingStatus: payload.status || "published",
        images: payload.images || [],
        description: payload.description || "",
      },
    })

    if (r?.ok === false) return { success: false, error: r?.error || "UPSERT_FAILED" }

    const id = String(r?.ownerId ?? r?.listing?.id ?? "")
    return { success: true, id: id || undefined }
  } catch (e: any) {
    return { success: false, error: e?.message || "UPSERT_FAILED" }
  }
}

export async function searchListings(params: {
  queryText?: string
  filters?: SearchFilters
}): Promise<{ success: boolean; listings: PropertyListing[]; error?: string }> {
  try {
    const r = await n8nPost<{ ok: boolean; properties: any[] }>("/api/listings/search", {
      queryText: params.queryText || "",
      filters: params.filters || {},
    })

    const listings = Array.isArray(r?.properties) ? r.properties.map(mapN8nListingToUI) : []
    return { success: true, listings }
  } catch (e: any) {
    return { success: false, listings: [], error: e?.message || "SEARCH_FAILED" }
  }
}

export async function getMyListings(): Promise<{
  success: boolean
  listings: PropertyListing[]
  error?: string
}> {
  try {
    const current = getCurrentUser()
    const ownerEmail = String(current?.email ?? "")
      .trim()
      .toLowerCase()

    if (!ownerEmail) return { success: false, listings: [], error: "NOT_LOGGED_IN" }

    const token = await getIdTokenSafe()
    if (!token) return { success: false, listings: [], error: "NOT_LOGGED_IN" }

    const res = await fetch(`/api/n8n/api/listings/mine?email=${encodeURIComponent(ownerEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: ownerEmail }),
      cache: "no-store",
    })

    const data = await res.json().catch(() => ({ ok: false, listings: [] }))

    if (data.ok && Array.isArray(data.listings)) {
      const listings = data.listings.map(mapN8nListingToUI)
      return { success: true, listings }
    }

    return { success: true, listings: [] }
  } catch (e: any) {
    console.error("[v0] Error fetching my listings:", e)
    return { success: false, listings: [], error: e?.message || "FETCH_FAILED" }
  }
}

export async function updateListing(
  id: string,
  updates: Partial<PropertyListing>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = getCurrentUser()
    const ownerEmail = String(current?.email ?? "")
      .trim()
      .toLowerCase()
    if (!ownerEmail) return { success: false, error: "NOT_LOGGED_IN" }

    const merged: PropertyListing = {
      id: id || "",
      ownerName: String(current?.name ?? updates.ownerName ?? ""),
      ownerEmail,
      ownerPhone: String(current?.phone ?? updates.ownerPhone ?? ""),
      propertyAddress: updates.propertyAddress ?? "",
      propertyTypeAndSize: updates.propertyTypeAndSize ?? "",
      pricePeriodCurrency: updates.pricePeriodCurrency ?? "",
      hasSalaryGuarantors: updates.hasSalaryGuarantors ?? false,
      guarantorsMinSalary: updates.guarantorsMinSalary,
      petsQuantitySizeAndType: updates.petsQuantitySizeAndType,
      hasLandlordGuarantors: updates.hasLandlordGuarantors ?? "",
      status: updates.status ?? "published",
      createdAt: updates.createdAt ?? new Date().toISOString(),
      images: updates.images,
      description: updates.description,
    }

    const r = await n8nPost<any>("/api/listings/upsert", {
      owner: {
        name: String(current?.name ?? merged.ownerName ?? ""),
        email: ownerEmail,
        phone: String(current?.phone ?? merged.ownerPhone ?? ""),
        address: String(current?.address ?? ""),
      },
      listing: {
        id: id,
        propertyAddress: merged.propertyAddress,
        propertyTypeAndSize: merged.propertyTypeAndSize,
        pricePeriodCurrency: merged.pricePeriodCurrency,
        hasSalaryGuarantors: toYesNo(merged.hasSalaryGuarantors),
        guarantorsMinSalary: merged.guarantorsMinSalary || "",
        petsQuantitySizeAndType: merged.petsQuantitySizeAndType || "",
        hasLandlordGuarantors: merged.hasLandlordGuarantors,
        listingStatus: merged.status || "published",
        images: merged.images || [],
        description: merged.description || "",
      },
    })

    if (r?.ok === false) return { success: false, error: r?.error || "UPSERT_FAILED" }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e?.message || "UPSERT_FAILED" }
  }
}

export async function deleteListing(id: string): Promise<{ success: boolean; error?: string }> {
  return updateListing(id, { status: "paused" })
}

export async function triggerAIMatching(
  tenantId: string,
  preferences: any,
): Promise<{ success: boolean; error?: string }> {
  console.log("[v0] AI Matching hook ready. tenantId:", tenantId, "prefs:", preferences)
  return { success: true }
}

// ---------- session helpers ----------
export function getCurrentUser() {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(STORAGE_KEYS.USER)
  return stored ? JSON.parse(stored) : null
}

export function getCurrentRole(): UserRole | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole | null
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.ROLE)
}

function getStoredListings(): PropertyListing[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.LISTINGS)
  return stored ? JSON.parse(stored) : []
}
