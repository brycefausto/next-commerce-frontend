"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/stringUtils"
import { useCompanyContext } from "@/stores/company.store"
import { CircleCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCheckoutStore } from "../createCheckoutStore"

export default function ThankYou() {
  const router = useRouter()
  const { slug } = useCompanyContext()
  const { state, resetCheckoutState } = useCheckoutStore()
  const [{ order, isCheckoutSubmitted, isBankTransfer }] = useState(state)

  // Redirect to shop if someone tries to access this page directly without checking out
  useEffect(() => {
    if (!isCheckoutSubmitted) {
      router.push(`/${slug}/shop`)
    }

    return () => resetCheckoutState()
  }, [isCheckoutSubmitted, resetCheckoutState, router, slug])

  if (!isCheckoutSubmitted) {
    return
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CircleCheck className="h-[100px] w-[100px]" color="green" />
        </div>

        <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>

        <p className="text-xl">
          Your order has been received and is now being processed.
        </p>

        <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
          <p className="mb-4">
            We&apos;ve sent a confirmation email with your order details and
            tracking information.
          </p>
          <p>
            Your order number is:{" "}
            <span className="font-bold">ORDER-#{order?.id}</span>
          </p>
          <p>
            <span className="font-bold">
              Total: {formatPrice(order?.total || 0)}
            </span>
          </p>
        </div>

        {isBankTransfer && (
          <div className="flex flex-col gap-4">
            <p className="text-xl font-bold">
              Please transfer your payment to the following bank/s:
            </p>
            <div className="max-w-md mx-auto bg-gray-200 shadow-lg rounded-2xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Bank Information
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 font-bold">Bank Name:</span>
                  <span className="text-gray-900">XBank Inc.</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 font-bold">
                    Account Holder:
                  </span>
                  <span className="text-gray-900">John Doe</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 font-bold">
                    Account Number:
                  </span>
                  <span className="text-gray-900 tracking-widest">
                    1234 5678 9012 3456
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-8">
          <Button asChild size="lg">
            <Link href={`/${slug}/shop`}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
