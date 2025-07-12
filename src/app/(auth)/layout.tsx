import ServerLoaderLayout from "@/components/layouts/ServerLoaderLayout"
import { PropsWithChildren } from "react"

export interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: PropsWithChildren) {
  return <ServerLoaderLayout>{children}</ServerLoaderLayout>
}
