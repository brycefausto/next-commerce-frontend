"use client"

import { AppPagination } from "@/components/app-pagination"
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
import usePageUtils from "@/hooks/use-page-utils"
import useSlug from "@/hooks/use-slug"
import { formatPrice } from "@/lib/stringUtils"
import { InventoryItem } from "@/models/inventory"
import { useAlertModal } from "@/providers/alert.modal.provider"
import { useInventoryStore } from "@/stores/inventory-store"
import { ListComponentProps } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Eye, Plus, SearchIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { deleteItemAction, updateItemAction } from "./actions"
import { EditInventoryItemData, editInventorySchema } from "./EditItemSchema"

export default function InventoryList({
  data,
  page,
  search,
}: ListComponentProps<InventoryItem>) {
  const { addSlug } = useSlug()
  const inventory = data.docs
  const totalPages = data.totalPages || 0
  const {
    searchValue,
    changePage,
    handleSearchClick,
    handleSearchChange,
    handleSearchEnter,
  } = usePageUtils(search)
  const { loading, setLoading } = useInventoryStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined | null>()
  const { showDeleteModal } = useAlertModal()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditInventoryItemData>({
    resolver: zodResolver(editInventorySchema),
  })

  const onEditSubmit = async (data: EditInventoryItemData) => {
    if (!selectedItem) return

    try {
      const result = await updateItemAction(selectedItem.id, data)
      if (result.success) {
        setIsEditOpen(false)
        setSelectedItem(null)
        reset()
      }
    } catch (error) {
      console.error("Failed to update inventory item:", error)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item)
    setValue("stock", item.stock)
    setValue("minStock", item.minStock)
    setValue("maxStock", item.maxStock)
    setValue("price", item.price)
    setIsEditOpen(true)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  const getStockStatus = (item: any) => {
    if (item.quantity <= item.min_stock) {
      return { status: "Low Stock", variant: "destructive" as const }
    }
    if (item.quantity >= item.max_stock) {
      return { status: "Overstock", variant: "secondary" as const }
    }
    return { status: "Normal", variant: "default" as const }
  }

  const handleDelete = async (inventoryItem: InventoryItem) => {
    showDeleteModal("Inventory Item", async () => {
      try {
        const result = await deleteItemAction(inventoryItem.id)
        if (result.success) {
          toast.success(result.message)
        }
      } catch (error) {
        console.error("Failed to delete item:", error)
      }
    })
  }

  // const lowStockItems = inventory.filter((item) => item.quantity <= item.min_stock)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your inventory stock levels
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
            <Link href={addSlug("/inventory/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Inventory Item
            </Link>
          </Button>
        </div>
      </div>

      {/* {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-orange-700">
              {lowStockItems.length} item(s) are running low on stock and need restocking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.product?.name}</span>
                  <span className="text-sm text-orange-700">
                    {item.quantity} / {item.min_stock} min
                  </span>
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <p className="text-sm text-orange-700">And {lowStockItems.length - 3} more items...</p>
              )}
            </div>
          </CardContent>
        </Card>
      )} */}

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
                    <TableHead>Product</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Max Stock</TableHead>
                    <TableHead>Price</TableHead>
                    {/* <TableHead>Location</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const stockStatus = getStockStatus(item)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.product?.name}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.variant?.name}
                        </TableCell>
                        <TableCell>{item.variant?.sku}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.minStock}</TableCell>
                        <TableCell>{item.maxStock}</TableCell>
                        <TableCell>{formatPrice(item.price)}</TableCell>
                        {/* <TableCell>{item.location || "N/A"}</TableCell> */}
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              color="green"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              color="red"
                              size="sm"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the inventory information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-product_id">Product</Label>
              <span>{selectedItem?.product?.name}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-product_id">Variant</Label>
              <span>{selectedItem?.variant?.name}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">Current Stock</Label>
              <Input
                id="edit-stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-min_stock">Minimum Stock</Label>
              <Input
                id="edit-min_stock"
                type="number"
                {...register("minStock", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.minStock && (
                <p className="text-sm text-red-500">
                  {errors.minStock.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-max_stock">Maximum Stock</Label>
              <Input
                id="edit-max_stock"
                type="number"
                {...register("maxStock", { valueAsNumber: true })}
                placeholder="1000"
              />
              {errors.maxStock && (
                <p className="text-sm text-red-500">
                  {errors.maxStock.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                startContent={
                  <div className="pointer-events-none">
                    <span className="text-default-400 text-small">₱</span>
                  </div>
                }
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                min={0}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inventory Details</DialogTitle>
            <DialogDescription>
              View inventory item information.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Product</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.variant?.name}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Quantity</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.stock}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Minimum Stock</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.minStock}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Maximum Stock</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.maxStock}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge variant={getStockStatus(selectedItem).variant}>
                  {getStockStatus(selectedItem).status}
                </Badge>
              </div>
              {/* <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedItem.updatedAt).toLocaleDateString()}
                </p>
              </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
