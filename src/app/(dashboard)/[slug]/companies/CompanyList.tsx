"use client"

import { AppPagination } from "@/components/app-pagination"
import ImageHolder from "@/components/image-holder/ImageHolder"
import ProfileAvatar from "@/components/profile-avatar/ProfileAvatar"
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
import { BASE_COMPANIES_IMAGE_URL } from "@/config/env"
import usePageUtils from "@/hooks/use-page-utils"
import useSlug from "@/hooks/use-slug"
import { addressInfoToString } from "@/lib/stringUtils"
import { Company } from "@/models/company"
import { useAlertModal } from "@/providers/alert.modal.provider"
import { useUserContext } from "@/stores/user.store"
import { ListComponentProps } from "@/types"
import { EditIcon, Eye, Plus, SearchIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { deleteCompanyAction } from "./actions"

export default function CompanyList({
  data,
  page,
  search,
}: ListComponentProps<Company>) {
  const { user: currentUser } = useUserContext()
  const { addSlug } = useSlug()
  const companies = data.docs || []
  const totalPages = data.totalPages || 0
  const {
    searchValue,
    changePage,
    handleSearchClick,
    handleSearchChange,
    handleSearchEnter,
  } = usePageUtils(search)
  const [loading, setLoading] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const { showDeleteModal } = useAlertModal()

  const handleView = (company: Company) => {
    setSelectedCompany(company)
    setIsViewOpen(true)
  }

  const handleDelete = async (company: Company) => {
    showDeleteModal("User", async () => {
      try {
        await deleteCompanyAction(company)
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    })
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
            <Link href={addSlug("/companies/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-row gap-4 items-center">
                          <ImageHolder
                            src={BASE_COMPANIES_IMAGE_URL + company.logo || ""}
                            alt={company.name}
                            width={100}
                            height={100}
                            className="rounded"
                          />
                          <span className="font-medium">{company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{company.slug}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell>
                        {addressInfoToString(company.address)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(company)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            color="green"
                            size="sm"
                            asChild
                          >
                            <Link href={addSlug(`/companies/edit/${company.id}`)}>
                              <EditIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                          {company.id !== currentUser?.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              color="red"
                              onClick={() => handleDelete(company)}
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
            </>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information.</DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <div className="w-[100px] h-[100px]">
                <ProfileAvatar
                  baseUrl={BASE_COMPANIES_IMAGE_URL}
                  src={selectedCompany.logo}
                  name={selectedCompany.name}
                  size={100}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCompany.name}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCompany.email}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCompany.phone}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-muted-foreground">
                  {addressInfoToString(selectedCompany.address)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
