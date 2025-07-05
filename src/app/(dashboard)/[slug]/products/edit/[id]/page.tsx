import { productService } from "@/services/product.service"
import { ParamsWithId } from "@/types"
import { notFound } from "next/navigation"
import EditProductForm from "./EditProductForm"

export default async function EditProductPage({ params }: ParamsWithId) {
  const { id } = await params
  const product = await productService.findOne(id)

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} />
}
