"use server"
import { imagekit } from "@/config/imagekit"

export async function uploadImageAction(file?: File | null, fileName?: string | null, folder?: string | null) {
    if (!file || !fileName || !folder) {
      return { error: "File, fileName, and folder are required" }
    }
  
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
  
    const res = await imagekit.upload({
      file: buffer,
      fileName,
      folder
    })

    return { success: true, data: res }
}

export async function deleteImageAction(name: string) {
  const result = await imagekit.listFiles({
    searchQuery : `name="${name}"`
  })
  
  if (result.length > 0 && "fileId" in result[0]) {
    await imagekit.deleteFile(result[0].fileId)
  } else {
    return { error: "Image Not Found" }
  }

  return { success: true }
}