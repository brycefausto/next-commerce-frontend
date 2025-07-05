"use client"

import { CompanyForm } from "./company-form"
import { UserForm } from "./user-form"
import { StepIndicator } from "./step-indicator"
import { useFormStore } from "./store"
export default function CreateCompanyPage() {
  const { currentStep } = useFormStore()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600">Create your company and user account in just 2 simple steps</p>
        </div>

        <StepIndicator />

        <div className="mt-8">
          {currentStep === 1 && <CompanyForm />}
          {currentStep === 2 && <UserForm />}
        </div>
      </div>
    </div>
  )
}
