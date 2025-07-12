"use client"

import { AppPagination } from "@/components/app-pagination"
import ProfileAvatar from "@/components/profile-avatar/ProfileAvatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BASE_USERS_IMAGE_URL } from "@/config/env"
import usePageUtils from "@/hooks/use-page-utils"
import useSlug from "@/hooks/use-slug"
import { AppUser, UserRole } from "@/models/user"
import { useAlertModal } from "@/providers/alert.modal.provider"
import { useUserContext } from "@/stores/user.store"
import { ListComponentProps } from "@/types"
import {
  EditIcon,
  Eye,
  Plus,
  SearchIcon,
  Shield,
  Trash2,
  User,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { deleteUserAction } from "./actions"

export default function UsersList({
  data,
  page,
  search,
}: ListComponentProps<AppUser>) {
  const { user: currentUser } = useUserContext()
  const { addSlug } = useSlug()
  const isSuperAdmin = currentUser?.role == UserRole.SUPER_ADMIN
  const users = data.docs || []
  const totalPages = data.totalPages || 0
  const {
    searchValue,
    changePage,
    handleSearchClick,
    handleSearchChange,
    handleSearchEnter,
  } = usePageUtils(search)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const { showDeleteModal } = useAlertModal()

  const handleView = (user: any) => {
    setSelectedUser(user)
    setIsViewOpen(true)
  }

  const handleDelete = async (user: AppUser) => {
    showDeleteModal("User", async () => {
      const result = await deleteUserAction(user)
      if (result.success) {
        toast.success(result.message || "User deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete user")
      }
    })
  }

  const getColorByRole = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "green"
      case UserRole.ADMIN:
        return "blue"
      case UserRole.DISTRIBUTOR:
        return "teal"
      case UserRole.RESELLER:
        return "red"
      case UserRole.CUSTOMER:
        return "orange"
      case UserRole.VIP:
        return "pink"
      default:
        return "gray"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-row">
            <Input
              name="search"
              placeholder="Search"
              value={searchValue}
              endContent={
                <Button variant="ghost" onClick={handleSearchClick}>
                  <SearchIcon />
                </Button>
              }
              onChange={handleSearchChange}
              onKeyDown={handleSearchEnter}
            />
          </div>

          <Button asChild>
            <Link href={addSlug("/users/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                {isSuperAdmin && <TableHead>Company</TableHead>}
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {user.id == currentUser?.id && (
                      <Badge variant="outline" className="ml-2">
                        Current User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  {isSuperAdmin && <TableCell>{user.company?.name}</TableCell>}
                  <TableCell>
                    <Badge color={getColorByRole(user.role)}>
                      {user.role === UserRole.SUPER_ADMIN ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      <span>{user.role}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" color="green" size="sm" asChild>
                        <Link href={addSlug(`/users/edit/${user.id}`)}>
                          <EditIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          color="red"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AppPagination
            initialPage={page}
            total={totalPages}
            onChangePage={changePage}
          />
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="w-[100px] h-[100px]">
                <ProfileAvatar
                  baseUrl={BASE_USERS_IMAGE_URL}
                  src={selectedUser.image}
                  name={selectedUser.name}
                  size={100}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.name}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <div className="flex items-center">
                  <Badge color={getColorByRole(selectedUser.role)}>
                    {selectedUser.role === UserRole.SUPER_ADMIN ? (
                      <Shield className="w-3 h-3 mr-1" />
                    ) : (
                      <User className="w-3 h-3 mr-1" />
                    )}
                    <span>{selectedUser.role}</span>
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.phone}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.address}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedUser.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
