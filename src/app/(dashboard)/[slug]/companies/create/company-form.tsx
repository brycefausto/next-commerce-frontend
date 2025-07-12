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
import { Textarea } from "@/components/ui/textarea"
import { slugify } from "@/lib/stringUtils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, FileText, Mail, MapPin, Phone } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  createCompanySchema,
  type CreateCompanyData,
} from "./CreateCompanySchema"
import { useFormStore } from "./store"

export function CompanyForm() {
  const { companyData, setCompanyData, nextStep } = useFormStore()

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateCompanyData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: companyData,
    mode: "onChange",
  })

  const name = watch("name")

  useEffect(() => {
    const slug = slugify(name)
    setValue("slug", slug)
  }, [name])

  const onSubmit = (data: CreateCompanyData) => {
    setCompanyData(data)
    nextStep()
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription>
          Enter your company details to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter company name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Company Slug *</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="company-slug"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
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
              placeholder="company@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
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

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Enter your street address"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2 (optional)</Label>
              <Input
                id="address2"
                {...register("address2")}
                placeholder="Suite, Unit, Building, Floor, etc."
              />
              {errors.address2 && (
                <p className="text-sm text-red-500">
                  {errors.address2.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city")} placeholder="City" />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input id="state" {...register("state")} placeholder="State" />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code (optional)</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="ZIP/Postal Code"
                  maxLength={5}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="United States"
                  defaultValue="Philippines"
                />
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of your company..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!isValid}>
            Continue to User Setup
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
