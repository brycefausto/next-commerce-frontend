import { deleteImageAction, uploadImageAction } from "./actions/image-actions";

export async function uploadImage(file: File, folder: string, oldImageName?: string) {

  if (oldImageName) {
    const deleteRes = await deleteImageAction(oldImageName)

    if (!deleteRes.success) {
      console.log(deleteRes.error)
    }
  }

  const uploadRes = await uploadImageAction(file, file.name, folder)

  return uploadRes
}

export async function deleteImage(name: string) {
  return await deleteImageAction(name);
}
