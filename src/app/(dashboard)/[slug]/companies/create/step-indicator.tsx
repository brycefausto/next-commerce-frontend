"use client"

import { Check } from "lucide-react"
import { useFormStore } from "./store"

export function StepIndicator() {
  const { currentStep } = useFormStore()

  const steps = [
    { number: 1, title: "Company Info", description: "Basic company details" },
    { number: 2, title: "User Account", description: "Create your account" },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep > step.number
                    ? "bg-green-500 border-green-500 text-white"
                    : currentStep === step.number
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? "bg-green-500" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
