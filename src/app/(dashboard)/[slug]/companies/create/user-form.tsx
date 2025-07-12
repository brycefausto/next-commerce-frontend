"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import useSlug from "@/hooks/use-slug"
import { CreateCompanyDto } from "@/models/company"
import { UserRole } from "@/models/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Lock, Mail, MapPin, Phone, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createCompanyAction } from "../actions"
import { createUserSchema, type CreateUserData } from "./CreateCompanySchema"
import { useFormStore } from "./store"

export function UserForm() {
  const { userData, setUserData, prevStep, companyData } = useFormStore()
  const { slugRouterPush } = useSlug()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: userData,
    mode: "onChange",
  })

  const onSubmit = async (data: CreateUserData) => {
    setUserData(data)
    const createDto: CreateCompanyDto = {
      name: companyData.name,
      slug: companyData.slug,
      description: companyData.description,
      email: companyData.email,
      phone: companyData.phone,
      address: {
        address: companyData.address,
        address2: companyData.address2,
        city: companyData.city,
        state: companyData.state,
        zipCode: companyData.zipCode,
        country: companyData.country,
      },
      user: { ...data, role: UserRole.ADMIN },
    }
    const resultState = await createCompanyAction(
      createDto,
      companyData.logoFile,
    )
    if (resultState.success) {
      toast.success("Company and user account created successfully!")
      slugRouterPush("/companies")
    } else {
      toast.error(
        resultState.error || "Failed to create company and user account.",
      )
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Account Setup
        </CardTitle>
        <CardDescription>
          Create your user account for {companyData.name || "your company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" {...register("name")} placeholder="John Doe" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john@example.com"
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password *
              </Label>
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="Enter password"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Confirm Password *
              </Label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="123 Main St, City, State 12345"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={!isValid}>
              Create Account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
