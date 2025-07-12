"use client"

import ImageHolder from "@/components/image-holder/ImageHolder"
import FormLayout from "@/components/layouts/FormLayout"
import { Button } from "@/components/ui/button"
import NumberInput from "@/components/ui/number-input"
import { Separator } from "@/components/ui/separator"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import { paymentLogos } from "@/config/paymentsLogos"
import useSlug from "@/hooks/use-slug"
import { formatPrice } from "@/lib/stringUtils"
import { useAlertModal } from "@/providers/alert.modal.provider"
import { useCartStore } from "@/stores/cart.store"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function CartForm() {
  const { addSlug } = useSlug()
  const [mounted, setMounted] = useState(false)
  const {
    items,
    removeItem,
    updateQuantity,
    getCartTotal: getSubtotal,
    getCartTotal: getTotal,
  } = useCartStore()
  const { showDeleteModal } = useAlertModal()
  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
    // Initialize the store after hydration
    useCartStore.persist.rehydrate()
  }, [])

  // Calculate cart totals
  const subtotal = mounted ? getSubtotal() : 0
  const shipping = subtotal > 0 ? 10.0 : 0
  const total = mounted ? getTotal() : 0

  const handleRemoveItem = (id: string, name: string) => {
    showDeleteModal("item", () => {
      removeItem(id)
      toast.success("Item removed", {
        description: `${name} has been removed from your cart.`,
      })
    })
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity)
    }
  }

  // Don't render cart items until after hydration
  const cartItems = mounted ? items : []

  return (
    <FormLayout backUrl={addSlug("/shop")}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Button asChild>
              <Link href={addSlug("/shop")}>Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted px-6 py-4">
                  <h2 className="font-semibold text-lg">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageHolder
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          src={
                            item.image ? BASE_ITEMS_IMAGE_URL + item.image : ""
                          }
                          alt={item.name}
                          width={200}
                          height={200}
                          radius="none"
                        />
                      </div>

                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <label
                              htmlFor={`quantity-${item.id}`}
                              className="sr-only"
                            >
                              Quantity
                            </label>
                            <NumberInput
                              defaultValue={item.quantity}
                              onChange={(value) =>
                                handleQuantityChange(item.id, value)
                              }
                            />
                          </div>

                          <div className="text-right min-w-[80px]">
                            <p className="font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          <button
                            className="text-gray-500 hover:text-red-500"
                            aria-label={`Remove ${item.name} from cart`}
                            onClick={() => handleRemoveItem(item.id, item.name)}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-muted/50 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={addSlug("/shop")}>Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border overflow-hidden sticky top-4">
                <div className="bg-muted px-6 py-4">
                  <h2 className="font-semibold text-lg">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <Button className="w-full mt-4" size="lg" asChild>
                    <Link href={addSlug("/checkout")}>Proceed to Checkout</Link>
                  </Button>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>We accept:</p>
                    <div className="flex gap-2 mt-2">
                      {Object.entries(paymentLogos).map(([key, logo]) => (
                        <div key={key} className="h-16 w-20 rounded">
                          <ImageHolder src={logo} width={60} height={60} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormLayout>
  )
}
