"use server"

import { BASE_COMPANIES_IMAGE_FOLDER } from "@/config/env"
import { deleteImage, uploadImage } from "@/lib/imagekitLib"
import { getErrorMessage } from "@/lib/serverFetch"
import { Company, CreateCompanyDto, UpdateCompanyDto } from "@/models/company"
import { companyService } from "@/services/company.service"
import { ActionResultState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createCompanyAction(
  data: CreateCompanyDto,
  imageFile?: File,
): Promise<ActionResultState<Company>> {
  const createUserDto = data

  try {
    const company = await companyService.create(createUserDto)
    revalidatePath("/companies")

    if (imageFile) {
      const imageUpdateResult = await updateCompanyLogoAction(
        company.id,
        imageFile,
      )
      if (imageUpdateResult.error) {
        return {
          error: "Failed to update company logo",
        }
      }
    }

    return { success: true, data: company }
  } catch (error: any) {
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function updateCompanyAction(
  id: string,
  data: UpdateCompanyDto,
  imageFile?: File | null,
): Promise<ActionResultState> {
  try {
    const company = await companyService.update(id, data)

    if (imageFile) {
      const imageUpdateResult = await updateCompanyLogoAction(
        id,
        imageFile,
        company.logo,
      )
      if (imageUpdateResult.error) {
        return {
          error: "Failed to update company logo",
        }
      }
    }

    revalidatePath("/companies")
    return {
      success: true,
      data: company,
    }
  } catch (error: any) {
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function updateCompanyLogoAction(
  id: string,
  image: File,
  oldImageName?: string,
): Promise<ActionResultState> {
  try {
    const result = await uploadImage(
      image,
      BASE_COMPANIES_IMAGE_FOLDER,
      oldImageName,
    )

    if (result.success && result.data) {
      await companyService.updateLogo(id, result.data.name)
      revalidatePath("/companies")

      return {
        success: true,
        message: "Successfully updated company logo",
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

export async function deleteCompanyAction(company: Company) {
  if (company.logo) {
    await deleteImage(company.logo)
  }
  await companyService.delete(company.id)

  revalidatePath("/companies")
}
