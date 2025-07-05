import FormLayout from "@/components/layouts/FormLayout"
import { productService } from "@/services/product.service"
import { ParamsWithId } from "@/types"
import { notFound } from "next/navigation"
import ProductDetailsForm from "./ProductDetails"

export default async function ProductPage({ params }: ParamsWithId) {
  const { id } = await params
  const product = await productService.findOne(id)

  if (!product) {
    notFound()
  }

  return (
    <FormLayout>
      <ProductDetailsForm product={product} />
    </FormLayout>
  )
}
