import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { firebaseApp } from "./firebaseClient"

let storage: ReturnType<typeof getStorage> | null = null

function getStorageInstance() {
  if (!storage) {
    storage = getStorage(firebaseApp)
  }
  return storage
}

export async function uploadPropertyImage(file: File, propertyId: string): Promise<string> {
  console.log("[v0] Uploading image:", file.name, "for property:", propertyId)
  const timestamp = Date.now()
  const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
  const storageRef = ref(getStorageInstance(), `properties/${propertyId}/${filename}`)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)
  console.log("[v0] Image uploaded successfully:", downloadURL)

  return downloadURL
}

export async function deletePropertyImage(imageUrl: string): Promise<void> {
  try {
    console.log("[v0] Deleting image:", imageUrl)
    const imageRef = ref(getStorageInstance(), imageUrl)
    await deleteObject(imageRef)
    console.log("[v0] Image deleted successfully")
  } catch (error) {
    console.error("[v0] Error deleting image:", error)
  }
}
