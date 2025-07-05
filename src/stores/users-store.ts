import { AppUser } from "@/models/user"
import { create } from "zustand"

interface UsersState {
  users: AppUser[]
  loading: boolean
  setUsers: (users: AppUser[]) => void
  addUser: (user: AppUser) => void
  updateUser: (id: string, user: Partial<AppUser>) => void
  removeUser: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  loading: false,
  setUsers: (users) => set({ users }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)),
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}))
