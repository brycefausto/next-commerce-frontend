import { Company } from "./company"

export interface AppUser {
  id: string
  name: string
  email: string
  company?: Company
  phone?: string
  address?: string
  image?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  ADMIN = "Admin",
  DISTRIBUTOR = "Distributor",
  RESELLER = "Reseller",
  VIP = "VIP",
  CUSTOMER = "Customer"
}

export const userRoles = Object.values(UserRole)

export const getUserRoles = (userRole?: UserRole) => {
  if (userRole != UserRole.SUPER_ADMIN) {
    return userRoles.filter(it => it != UserRole.SUPER_ADMIN)
  }

  return userRoles
}

export type LoginDto = {
  email: string;
  password: string;
}

export type RegisterDto = Omit<AppUser, "id"> & {
  password: string
  confirmPassword: string
}

export type UserDto = Omit<AppUser, "id" | "createdAt" | "updatedAt">

export type CreateUserDto = UserDto & {
  companyId?: string,
  password: string,
  confirmPassword?: string
}

export type UpdateUserDto = Omit<UserDto, "password"> & {
  companyId?: string,
  image?: string
}
