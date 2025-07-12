"use server"

import { BASE_ITEMS_IMAGE_FOLDER } from "@/config/env"
import { deleteImage, uploadImage } from "@/lib/imagekitLib"
import { getErrorMessage } from "@/lib/serverFetch"
import { CreateProductDto, Product, UpdateProductDto } from "@/models/product"
import { productService } from "@/services/product.service"
import { ActionResultState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createProductAction(
  data: CreateProductDto,
  image: File,
): Promise<ActionResultState<Product>> {
  try {
    const product = await productService.create(data)

    const uploadResult = await updateProductImageAction(product.id, image)

    if (uploadResult.error) {
      return {
        error: uploadResult.error,
      }
    }

    revalidatePath("/products")

    return { success: true, data: product }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function updateProductAction(
  id: string,
  data: UpdateProductDto,
  image?: File,
): Promise<ActionResultState<Product>> {
  try {
    const product = await productService.update(id, data)
    console.log("product updated", id)

    if (image) {
      console.log("product image uploading", id)
      const uploadResult = await updateProductImageAction(product.id, image)

      if (uploadResult.error) {
        console.log("product image error", id)
        return {
          error: uploadResult.error,
        }
      }
    }

    revalidatePath("/products")

    return { success: true, data: product }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function updateProductImageAction(
  id: string,
  image: File,
  oldImageName?: string,
): Promise<ActionResultState> {
  try {
    const result = await uploadImage(
      image,
      BASE_ITEMS_IMAGE_FOLDER,
      oldImageName,
    )

    if (result.success && result.data) {
      await productService.updateImage(id, { image: result.data.name })

      return {
        success: true,
        message: "Successfully updated product image",
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

export async function updateProductVariantImageAction(
  id: string,
  image: File,
  oldImageName?: string,
): Promise<ActionResultState> {
  try {
    const result = await uploadImage(
      image,
      BASE_ITEMS_IMAGE_FOLDER,
      oldImageName,
    )

    if (result.success && result.data) {
      await productService.updateVariantImage(id, { image: result.data.name })

      return {
        success: true,
        message: "Successfully updated product variant image",
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

export async function deleteProductAction(product: Product) {
  if (product.image) {
    await deleteImage(product.image)
  }
  for (const variant of product.variants) {
    await deleteImage(variant.image)
  }

  await productService.delete(product.id)
  revalidatePath("/products")

  return { success: true, message: "Product deleted successfully" }
}
