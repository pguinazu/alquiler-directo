import type { TenantUser, LandlordUser, PropertyListing, UserRole, SearchFilters } from "@/types"

/**
 * API Layer - Integrated with n8n webhooks
 *
 * Expected n8n webhook paths (POST):
 * - /api/login
 * - /api/listings/search
 * - /api/listings/upsert
 * - /api/users/tenant/create
 * - /api/users/owner/create
 *
 * Env vars required (client-side):
 * - NEXT_PUBLIC_N8N_BASE_URL=https://your-n8n-domain.com
 * - NEXT_PUBLIC_N8N_WEBHOOK_PATH=/webhook   (or /webhook-test in dev)
 */

const STORAGE_KEYS = {
  USER: "real-estate-user",
  ROLE: "real-estate-role",
  LISTINGS: "real-estate-listings", // kept for legacy fallback (unused when n8n is enabled)
}

// ---------- n8n client ----------
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL
const N8N_WEBHOOK_PATH = process.env.NEXT_PUBLIC_N8N_WEBHOOK_PATH || "/webhook"

function assertEnv() {
  if (!N8N_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_N8N_BASE_URL. Set it in .env.local or Vercel env vars.")
  }
}

async function n8nPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`/api/n8n${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    cache: "no-store",
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`
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
  return "" // unknown
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
    images: Array.isArray(raw?.images) ? raw.images : undefined,
    description: raw?.description ? String(raw.description) : undefined,
  }
}

// ---------- auth ----------
export async function loginWithRole(
  email: string,
  password: string,
  role: UserRole,
): Promise<{ success: boolean; user?: any; error?: string }> {
  // password currently unused by n8n MVP (kept for UI compatibility)
  try {
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

      // n8n MVP expects strings like "Sí"/"No"
      hasSalaryGuarantors: toYesNo(payload.hasSalaryGuarantors),
      guarantorsMinSalary: payload.guarantorsMinSalary || "",
      guarantorsCUIL: Array.isArray(payload.guarantorsCUIL) ? payload.guarantorsCUIL.join(", ") : "",

      petsQuantitySizeAndType: payload.petsQuantitySizeAndType || "",
      hasLandlordGuarantors: payload.hasLandlordGuarantors || "",
    }

    const r = await n8nPost<any>("/api/users/tenant/create", body)

    if (r?.ok === false) return { success: false, error: r?.tenant?.error || r?.error || "CREATE_TENANT_FAILED" }

    // n8n currently may not return an id; keep UI-compatible return
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

    if (!ownerEmail) {
      return { success: false, listings: [], error: "NOT_LOGGED_IN" }
    }

    // Use the n8n API proxy to fetch listings by owner email
    const res = await fetch(`/api/n8n/api/listings/mine?email=${encodeURIComponent(ownerEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ownerEmail }),
      cache: "no-store",
    })

    const data = await res.json().catch(() => ({ ok: false, listings: [] }))

    if (data.ok && Array.isArray(data.listings)) {
      const listings = data.listings.map(mapN8nListingToUI)
      return { success: true, listings }
    }

    // If no listings or error, return empty array (not an error condition)
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
  // MVP: n8n upsert usa email del owner para identificar el doc.
  // El "id" que te pasa la UI hoy es local (mock); lo ignoramos en favor del owner actual.
  try {
    const current = getCurrentUser()
    const ownerEmail = String(current?.email ?? "")
      .trim()
      .toLowerCase()
    if (!ownerEmail) return { success: false, error: "NOT_LOGGED_IN" }

    const merged: PropertyListing = {
      // defaults to avoid undefined issues
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
        propertyAddress: merged.propertyAddress,
        propertyTypeAndSize: merged.propertyTypeAndSize,
        pricePeriodCurrency: merged.pricePeriodCurrency,
        hasSalaryGuarantors: toYesNo(merged.hasSalaryGuarantors),
        guarantorsMinSalary: merged.guarantorsMinSalary || "",
        petsQuantitySizeAndType: merged.petsQuantitySizeAndType || "",
        hasLandlordGuarantors: merged.hasLandlordGuarantors,
        listingStatus: merged.status || "published",
      },
    })

    if (r?.ok === false) return { success: false, error: r?.error || "UPSERT_FAILED" }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e?.message || "UPSERT_FAILED" }
  }
}

export async function deleteListing(id: string): Promise<{ success: boolean; error?: string }> {
  // MVP: no hay delete real aún -> soft delete (paused) via upsert
  return updateListing(id, { status: "paused" })
}

// Hook for future AI matching workflow
export async function triggerAIMatching(
  tenantId: string,
  preferences: any,
): Promise<{ success: boolean; error?: string }> {
  // TODO: When you expose n8n endpoint for match, wire it here.
  // e.g. POST /api/match
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

// ---------- legacy helper (kept for safety; not used when n8n is enabled) ----------
function getStoredListings(): PropertyListing[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.LISTINGS)
  return stored ? JSON.parse(stored) : []
}
