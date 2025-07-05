import React from 'react'
import AppLogo from './AppLogo'
import { AppUser, UserRole } from '@/models/user'
import { APP_NAME, BASE_COMPANIES_IMAGE_URL } from '@/config/env'
import { Company } from '@/models/company'

export default function AppTitle(
  { user, company }:
    {
      user?: AppUser | null,
      company?: Company | null
    }
) {
  const logoSrc = user?.role != UserRole.SUPER_ADMIN && company ?
    BASE_COMPANIES_IMAGE_URL + company?.logo : ""
  const companyName = user?.role != UserRole.SUPER_ADMIN ? company?.name : APP_NAME

  return (
    <div className="flex flex-row gap-2 items-center">
      <AppLogo src={logoSrc} />
      <p className="font-bold text-inherit">{companyName}</p>
    </div>
  )
}
