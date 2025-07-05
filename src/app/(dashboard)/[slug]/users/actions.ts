"use server"

import { BASE_USERS_IMAGE_FOLDER } from "@/config/env"
import { deleteImage, uploadImage } from "@/lib/imagekitLib"
import { getErrorMessage } from "@/lib/serverFetch"
import { AppUser, CreateUserDto, UpdateUserDto } from "@/models/user"
import { userService } from "@/services/user.service"
import { ActionResultState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createUserAction(
  dto: CreateUserDto,
  imageFile?: File,
): Promise<ActionResultState<AppUser>> {
  try {
    const user = await userService.create(dto)

    if (imageFile) {
      const imageUpdateResult = await updateUserImageAction(user.id, imageFile)
      if (imageUpdateResult.error) {
        return {
          error: "Failed to update user image",
        }
      }
    }

    revalidatePath("/users")

    return { success: true, data: user }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function updateUserAction(
  id: string,
  data: UpdateUserDto,
  imageFile?: File,
): Promise<ActionResultState<AppUser>> {
  const userDto = data
  try {
    const user = await userService.update(id, userDto)

    if (user) {
      if (imageFile) {
        const imageUpdateResult = await updateUserImageAction(
          user.id,
          imageFile,
        )
        if (imageUpdateResult.error) {
          return {
            error: "Failed to update user image",
          }
        }
      }

      revalidatePath("/users")
      return {
        success: true,
        message: "Successfully saved user",
        data: user,
      }
    } else {
      return {
        error: "User not found",
      }
    }
  } catch (error: any) {
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function updateUserImageAction(
  id: string,
  image: File,
  oldImageName?: string,
): Promise<ActionResultState> {
  try {
    const result = await uploadImage(
      image,
      BASE_USERS_IMAGE_FOLDER,
      oldImageName,
    )

    if (result.success && result.data) {
      await userService.updateImage(id, result.data.name)
      revalidatePath("/users")

      return {
        success: true,
        message: "Successfully updated user image",
      }
    } else {
      throw new Error(result.error || "Image upload failed")
    }
  } catch (error: any) {
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function deleteUserAction(user: AppUser) {
  try {
    if (user.image) {
      await deleteImage(user.image)
    }
    await userService.delete(user.id)
    revalidatePath("/users")

    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    return {
      error: getErrorMessage(error),
    }
  }
}
