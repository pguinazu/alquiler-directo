import { auth } from "@/lib/firebaseClient"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"

export async function signupEmailPassword(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const token = await cred.user.getIdToken(true)
  return { user: cred.user, token }
}

export async function signinEmailPassword(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const token = await cred.user.getIdToken()
  return { user: cred.user, token }
}

export async function logoutFirebase() {
  await signOut(auth)
}

export async function getIdTokenSafe(): Promise<string> {
  const u = auth.currentUser
  return u ? await u.getIdToken() : ""
}

export async function getAuthUid(): Promise<string> {
  const u = auth.currentUser
  return u ? u.uid : ""
}

export function waitForAuthReady(): Promise<void> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe()
        resolve()
      }
    })

    // Timeout después de 5 segundos
    setTimeout(() => {
      unsubscribe()
      resolve()
    }, 5000)
  })
}
