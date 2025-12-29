import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

function loadServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (json) {
    try {
      const sa = JSON.parse(json)
      if (sa.privateKey) sa.privateKey = String(sa.privateKey).replace(/\\n/g, "\n")
      return sa
    } catch (err) {
      console.error("[firebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", err)
      return null
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.error("[firebaseAdmin] Missing Firebase Admin env vars")
    return null
  }

  const privateKey = String(privateKeyRaw).replace(/\\n/g, "\n")
  return { projectId, clientEmail, privateKey }
}

let app: any = null
let adminAuthInstance: any = null

try {
  const serviceAccount = loadServiceAccount()
  if (serviceAccount) {
    app =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount as any),
          })
    adminAuthInstance = getAuth(app)
    console.log("[firebaseAdmin] Firebase Admin initialized successfully")
  } else {
    console.error("[firebaseAdmin] Could not load service account credentials")
  }
} catch (err) {
  console.error("[firebaseAdmin] Failed to initialize Firebase Admin:", err)
}

export const adminAuth = adminAuthInstance
