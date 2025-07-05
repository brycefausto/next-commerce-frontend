"use client"

import { AppPagination } from "@/components/app-pagination"
import ImageHolder from "@/components/image-holder/ImageHolder"
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
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import usePageUtils from "@/hooks/use-page-utils"
import { formatPrice } from "@/lib/stringUtils"
import { Product } from "@/models/product"
import { useAlertModal } from "@/providers/alert.modal.provider"
import { ListComponentProps } from "@/types"
import { Edit, Eye, Plus, SearchIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { deleteProductAction } from "./actions"
import useSlug from "@/hooks/use-slug"

export default function ProductList({
  data,
  page,
  search,
}: ListComponentProps<Product>) {
  const { addSlug } = useSlug()
  const products = data.docs || []
  const totalPages = data.totalPages || 0
  const {
    searchValue,
    changePage,
    handleSearchChange,
    handleSearchClick,
    handleSearchEnter,
  } = usePageUtils()
  const [loading, setLoading] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const { showDeleteModal } = useAlertModal()

  const handleView = (product: any) => {
    setSelectedProduct(product)
    setIsViewOpen(true)
  }

  const handleDelete = async (product: Product) => {
    showDeleteModal("Product", async () => {
      try {
        const result = await deleteProductAction(product)
        if (result.success) {
          toast.success(result.message)
        }
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
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
            <Link href={addSlug("/products/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
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
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex flex-row gap-4 items-center">
                          <ImageHolder
                            src={BASE_ITEMS_IMAGE_URL + product.image || ""}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="rounded"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.brand || "N/A"}</TableCell>
                      <TableCell>{product.category || "N/A"}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            color="green"
                            size="sm"
                          >
                            <Link
                              href={addSlug(`/products/edit/${product.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>View product information.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <ImageHolder
                  src={BASE_ITEMS_IMAGE_URL + selectedProduct.image || ""}
                  alt={selectedProduct.name}
                  width={100}
                  height={100}
                  className="rounded"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.name}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Brand</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.brand}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.description || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Price</Label>
                <p className="text-sm text-muted-foreground">
                  ${selectedProduct.price.toFixed(2)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.category || "N/A"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
