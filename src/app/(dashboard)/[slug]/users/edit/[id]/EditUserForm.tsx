"use client"

import ImageSelector from "@/components/image-holder/ImageSelector"
import FormLayout from "@/components/layouts/FormLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BASE_USERS_IMAGE_URL } from "@/config/env"
import useSlug from "@/hooks/use-slug"
import { AppUser, getUserRoles, UpdateUserDto, UserRole } from "@/models/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateUserAction, updateUserImageAction } from "../../actions"
import { UpdateUserData, updateUserSchema } from "./UpdateUserSchema"

interface EditUserFormProps {
  user: AppUser
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const { slugRouterPush } = useSlug()
  const [imageFile, setImageFile] = useState<File | undefined | null>()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      role: user.role || UserRole.ADMIN,
      phone: user.phone || "",
      address: user.address || "",
    },
  })

  const handleFormSubmit = async (data: UpdateUserData) => {
    try {
      const updateUserDto: UpdateUserDto = {
        ...data,
        companyId: user?.company?.id || "",
      }
      const result = await updateUserAction(user.id, updateUserDto)
      let success = false
      if (result?.success && result?.data) {
        if (imageFile) {
          const imageUpdateResult = await updateUserImageAction(
            result.data.id,
            imageFile,
            result.data.image || "",
          )
          if (imageUpdateResult.success) {
            success = true
          } else {
            toast.error(
              imageUpdateResult.error || "Failed to update user image",
            )
            return
          }
        } else {
          success = true
        }

        if (success) {
          toast.success("User updated successfully!")
          slugRouterPush("/users")
        }
      } else {
        toast.error(result?.error || "Failed to update user")
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update user")
    }
  }

  return (
    <FormLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <ImageSelector
                baseUrl={BASE_USERS_IMAGE_URL}
                required
                image={user.image || ""}
                onChangeFile={setImageFile}
                width={200}
                height={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                defaultValue={user.role}
                onValueChange={(val) => setValue("role", val as UserRole)}
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
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormLayout>
  )
}
