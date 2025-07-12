"use client"

import ImageSelector from "@/components/image-holder/ImageSelector"
import FormLayout from "@/components/layouts/FormLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BASE_USERS_IMAGE_URL } from "@/config/env"
import { CreateUserDto, getUserRoles, UserRole } from "@/models/user"
import { useUserContext } from "@/stores/user.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createUserAction } from "../actions"
import { CreateUserData, createUserSchema } from "./CreateUserSchema"
import useSlug from "@/hooks/use-slug"

export default function CreateUserForm() {
  const { slugRouterPush } = useSlug()
  const { user } = useUserContext()
  const [imageFile, setImageFile] = useState<File | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = async (data: CreateUserData) => {
    try {
      const createUserDto: CreateUserDto = {
        ...data,
      }
      if (user?.role == UserRole.ADMIN) {
        createUserDto.companyId =  user?.company?.id || ""
      }
      const result = await createUserAction(createUserDto, imageFile)
      if (result?.success && result?.data) {
        toast.success("User created successfully!")
        slugRouterPush("/users")
      } else {
        toast.error(result?.error || "Failed to create user")
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to create user")
    }
  }

  return (
    <FormLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <ImageSelector
                baseUrl={BASE_USERS_IMAGE_URL}
                required
                onChangeFile={setImageFile}
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) => setValue("role", value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {getUserRoles(user?.role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} placeholder="Optional" />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Optional"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormLayout>
  )
}
