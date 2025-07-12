"use client"

import FormLayout from "@/components/layouts/FormLayout"
import { CompanyForm } from "./company-form"
import { StepIndicator } from "./step-indicator"
import { useFormStore } from "./store"
import { UserForm } from "./user-form"
export default function CreateCompanyPage() {
  const { currentStep } = useFormStore()

  return (
    <FormLayout>
      <div className="max-w-4xl min-w-xl mx-auto px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Company</h1>
          <p className="text-gray-600">
            Create a company and user account in just 2 simple steps
          </p>
        </div>

        <StepIndicator />

        <div className="mt-8">
          {currentStep === 1 && <CompanyForm />}
          {currentStep === 2 && <UserForm />}
        </div>
      </div>
    </FormLayout>
  )
}
