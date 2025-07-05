import type { AppUser } from '@/models/user'
import { createContext, useContext } from 'react'
import { createStore, useStore } from 'zustand'

export interface UserProps {
  user: AppUser | null | undefined
}

export interface UserState extends UserProps {
  setUser: (user: AppUser) => void
  clearUser: () => void
}

export const createUserStore = (initProps?: Partial<UserProps>) => {
  const DEFAULT_PROPS: UserProps = {
    user: null,
  }
  return createStore<UserState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setUser: (user) => set(() => ({ user })),
    clearUser: () => set(() => ({ user: null })),
  }))
}

export type UserStore = ReturnType<typeof createUserStore>

export const UserContext = createContext<UserStore | null>(null)

export function useUserContext() {
  const store = useContext(UserContext)
  if (!store) throw new Error("Missing UserContext.Provider in the tree")
  return useStore(store, state => state)
}
