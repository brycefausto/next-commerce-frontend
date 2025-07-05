"use client"

import { useRef } from "react"
import { createUserStore, UserContext, type UserProps, type UserStore } from "@/stores/user.store"

type UserProviderProps = React.PropsWithChildren<UserProps>

export function UserProvider({ children, ...props }: UserProviderProps) {
  const storeRef = useRef<UserStore>(null)
  if (!storeRef.current) {
    storeRef.current = createUserStore(props)
  }

  return (
    <UserContext.Provider value={storeRef.current}>
      {children}
    </UserContext.Provider>
  )
}