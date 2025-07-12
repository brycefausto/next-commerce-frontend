import Image from "next/image"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Product } from "@/models/product"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price))
  const maxPrice = Math.max(...product.variants.map((v) => v.price))

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={BASE_ITEMS_IMAGE_URL + product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-semibold">
          {minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ShoppingBag className="h-4 w-4" />
          <span className="sr-only">Add to cart</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
