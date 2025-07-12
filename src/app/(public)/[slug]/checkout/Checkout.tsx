"use client"

import ImageHolder from "@/components/image-holder/ImageHolder"
import Loader from "@/components/Loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import { paymentLogos } from "@/config/paymentsLogos"
import useSlug from "@/hooks/use-slug"
import { getErrorMessage } from "@/lib/serverFetch"
import { formatPrice } from "@/lib/stringUtils"
import { CreateOrderDto, CreatePaymentDto, OrderItemDto } from "@/models/order"
import { PaymentStatus } from "@/models/payment"
import { useCartStore } from "@/stores/cart.store"
import { useCompanyContext } from "@/stores/company.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createOrderAction } from "./actions"
import { useCheckoutStore } from "./createCheckoutStore"
import { CreateOrderData, createOrderSchema } from "./CreateOrderSchema"

export default function Checkout() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { items, getCartTotal, clearCart } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [submitted, setSubmitted] = useState(false)
  const { slugRouterPush } = useSlug()
  const { company } = useCompanyContext()
  const { setCheckoutState } = useCheckoutStore()

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
    // Initialize the store after hydration
    useCartStore.persist.rehydrate()
  }, [])

  const getShippingFee = (shippingMethod: string) => {
    switch (shippingMethod) {
      case "standard":
        return 10.0
      case "express":
        return 10.0
      default:
        return 0
    }
  }

  // Calculate cart totals
  const subtotal = mounted ? getCartTotal() : 0
  const shipping = subtotal > 0 ? getShippingFee(shippingMethod) : 0
  const total = mounted ? subtotal + shipping : 0

  // Don't render cart items until after hydration
  const cartItems = mounted ? items : []

  // const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOrderSchema),
  })

  const handleCompleteOrder = handleSubmit(async (data: CreateOrderData) => {
    // In a real app, you would validate the form and process the payment here
    setLoading(true)

    try {
      const orderItems: OrderItemDto[] = cartItems.map(
        (cartItem) =>
          ({
            productVariantId: cartItem.id,
            price: cartItem.price,
            quantity: cartItem.quantity,
          } as OrderItemDto),
      )
      const addressInfo = {
        address: data.address,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      }

      const createPaymentDto: CreatePaymentDto = {
        paymentMethod,
        amount: total,
        status: PaymentStatus.PENDING,
      }

      const createOrderDto: CreateOrderDto = {
        companyId: company?.id || "",
        customerDto: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: addressInfo,
        },
        items: orderItems,
        payment: createPaymentDto,
        subtotal,
        shipping,
        total,
        shippingAddress: addressInfo,
        billingAddress: addressInfo,
      }
      const result = await createOrderAction(createOrderDto)
      if (result.success && result.data) {
        toast.success("Order placed successfully!", {
          description:
            "Thank you for your purchase. Your order has been received.",
        })
        setSubmitted(true)
        clearCart()
        setCheckoutState(result.data, true, paymentMethod == "bank_transfer")
        slugRouterPush("/checkout/thank-you")
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    }

    setLoading(false)
  })

  useEffect(() => {
    if (mounted && !submitted && !cartItems.length) {
      slugRouterPush("/shop")
    }
  }, [mounted, submitted, cartItems.length, slugRouterPush])

  return (
    <Loader loading={loading}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-500 mb-8">
          Complete your order by providing your shipping and payment details.
        </p>
        <form onSubmit={handleCompleteOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-6 py-4">
                  <h2 className="font-semibold text-lg">
                    1. Shipping Information
                  </h2>
                </div>
                <div className="p-6 grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="Enter your first name"
                        required
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                        required
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your street address"
                      required
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">
                        {errors.address?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input
                      id="address2"
                      placeholder="Apartment, suite, unit, etc."
                      {...register("address2")}
                    />
                    {errors.address2 && (
                      <p className="text-sm text-red-500">
                        {errors.address2?.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        required
                        {...register("city")}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        required
                        {...register("state")}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-500">
                          {errors.state?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code (optional)</Label>
                      <Input
                        id="zip"
                        placeholder="ZIP/Postal Code"
                        {...register("zipCode")}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-red-500">
                          {errors.zipCode?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        required
                        {...register("country")}
                        defaultValue="Philippines"
                      />
                      {errors.country && (
                        <p className="text-sm text-red-500">
                          {errors.country?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-6 py-4">
                  <h2 className="font-semibold text-lg">2. Shipping Method</h2>
                </div>
                <div className="p-6">
                  <RadioGroup
                    defaultValue="standard"
                    onValueChange={setShippingMethod}
                    required
                  >
                    {/* <div className="flex items-start space-x-3 space-y-0 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="standard" className="font-medium">
                          Standard Shipping
                        </Label>
                        <p className="text-sm text-gray-500">
                          Delivery in 3-5 business days
                        </p>
                        <p className="font-medium">{formatPrice(10.0)}</p>
                      </div>
                    </div> */}
                    <div className="flex items-start space-x-3 space-y-0 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="free" id="free" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="free" className="font-medium">
                          FREE Shipping
                        </Label>
                        <p className="text-sm text-gray-500">
                          Delivery in 3-5 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-y-0 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="express" id="express" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="express" className="font-medium">
                          Express Shipping
                        </Label>
                        <p className="text-sm text-gray-500">
                          Delivery in 1-2 business days
                        </p>
                        <p className="font-medium">{formatPrice(25.0)}</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-6 py-4">
                  <h2 className="font-semibold text-lg">3. Payment Method</h2>
                </div>
                <div className="p-6 space-y-6">
                  <RadioGroup
                    defaultValue={paymentMethod}
                    onValueChange={setPaymentMethod}
                    required
                  >
                    {/* <div className="flex items-center space-x-3 space-y-0 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="font-medium">
                        Credit Card
                      </Label>
                      <div className="flex gap-2 ml-auto">
                        {paymentLogos.slice(1).map((logo, i) => (
                          <div key={i} className="h-8 w-12 rounded">
                            <ImageHolder src={logo} />
                          </div>
                        ))}
                      </div>
                    </div> */}
                    <div className="flex items-center space-x-3 space-y-0 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="CASH" id="cash" />
                      <Label htmlFor="cash" className="font-medium">
                        Cash
                      </Label>
                      <div className="h-16 w-24 rounded ml-auto">
                        <ImageHolder
                          src={paymentLogos["cash"]}
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                    {/* <div className="flex items-center space-x-3 space-y-0 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="BANK TRANSFER" id="bank" />
                      <Label htmlFor="bank" className="font-medium">
                        Bank Transfer
                      </Label>
                      <div className="h-16 w-24 rounded ml-auto">
                        <ImageHolder
                          src={paymentLogos["bank"]}
                          width={100}
                          height={100}
                        />
                      </div>
                    </div> */}
                    {/* <div className="flex items-center space-x-3 space-y-0 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="font-medium">
                        PayPal
                      </Label>
                      <div className="h-8 w-12 rounded ml-auto">
                        <ImageHolder src={paymentLogos[0]} />
                      </div>
                    </div> */}
                  </RadioGroup>

                  {/* {paymentMethod == "credit-card" && (
                    <>
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="card-name">Name on Card</Label>
                          <Input id="card-name" placeholder="Enter name as it appears on card" required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="•••• •••• •••• ••••" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiration Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">Security Code (CVV)</Label>
                            <Input id="cvv" placeholder="•••" required />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="save-card" />
                        <Label htmlFor="save-card" className="text-sm">
                          Save this card for future purchases
                        </Label>
                      </div>
                    </>
                  )} */}
                </div>
              </div>

              {/* Billing Address */}
              {/* <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-6 py-4">
                  <h2 className="font-semibold text-lg">4. Billing Address</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox id="same-address" defaultChecked />
                    <Label htmlFor="same-address">
                      Same as shipping address
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Order Summary */}
            <div>
              <div className="border rounded-lg overflow-hidden sticky top-4">
                <div className="bg-muted px-6 py-4">
                  <h2 className="font-semibold text-lg">Order Summary</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <ImageHolder
                            src={BASE_ITEMS_IMAGE_URL + item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal (VAT Included)
                      </span>
                      <span className="font-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {formatPrice(shipping)}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <Button type="submit" className="w-full mt-6" size="lg">
                    Complete Order
                  </Button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Loader>
  )
}
