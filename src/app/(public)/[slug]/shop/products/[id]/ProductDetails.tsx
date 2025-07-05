"use client"

import ImageHolder from "@/components/image-holder/ImageHolder"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import useSlug from "@/hooks/use-slug"
import { formatPrice } from "@/lib/stringUtils"
import { ProductVariant, ViewProductDto } from "@/models/product"
import { useCartStore } from "@/stores/cart.store"
import { FaCartPlus } from "react-icons/fa"
import { toast } from "sonner"

export interface ProductDetailsProps {
  product: ViewProductDto
}

export default function ProductDetailsForm({ product }: ProductDetailsProps) {
  const { addItem } = useCartStore()
  const { slugRedirect } = useSlug()

  const handleAddToCart = (product: ProductVariant) => {
    addItem({
      id: product.id || "",
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })

    const toastId = toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
      action: {
        label: "Go to Cart",
        onClick: () => {
          toast.dismiss(toastId)
          slugRedirect("/cart")
        },
      },
    })
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Card>
        <CardContent>
          <div className="flex w-full max-w-xl flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
            <div className="flex flex-row">
              <p className="pb-4 text-left text-3xl font-semibold">
                Product Details
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ImageHolder
                src={product.image ? BASE_ITEMS_IMAGE_URL + product.image : ""}
                alt={product.name}
                width={200}
                height={200}
                radius="none"
              />
              <div className="space-y-1.5">
                <h3 className="font-semibold text-lg leading-none">
                  {product.name}
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="font-bold text-lg">Brand</p>
                <p className="text-lg">{product.brand}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-lg">Category</p>
                <p className="text-lg">{product.category}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-lg">Description</p>
                <p className="text-lg">{product.description}</p>
              </div>
              {product.variants.length == 1 ? (
                <div className="flex flex-col">
                  <p className="font-bold text-lg">Price</p>
                  <p className="text-lg">
                    {formatPrice(product.defaultVariant?.price || 0)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  <p className="font-bold text-lg">Variants</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>{""}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.variants.map((variant, i) => (
                        <TableRow key={i}>
                          <TableCell>{variant.name}</TableCell>
                          <TableCell>
                            <ImageHolder
                              src={
                                variant.image
                                  ? BASE_ITEMS_IMAGE_URL + variant.image
                                  : ""
                              }
                              alt={variant.name}
                              width={90}
                              height={90}
                              radius="none"
                            />
                          </TableCell>
                          <TableCell>{formatPrice(variant.price)}</TableCell>
                          <TableCell>
                            <Button
                              color="green"
                              onClick={() =>
                                handleAddToCart(variant as ProductVariant)
                              }
                            >
                              <FaCartPlus className="w-4 h-4" />
                              Add to Cart
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
