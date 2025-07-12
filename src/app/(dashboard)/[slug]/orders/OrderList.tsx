"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { isoToDateString } from "@/lib/dateUtils"
import { formatPrice } from "@/lib/stringUtils"
import { Order, OrderStatus, orderStatuses } from "@/models/order"
import { PaymentStatus, paymentStatuses } from "@/models/payment"
import { useAlertModal } from "@/providers/alert.modal.provider"
import { ListComponentProps } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Eye, Package, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { deleteOrderAction, updateOrderAction } from "./actions"
import { EditOrderData, editOrderSchema } from "./EditOrderSchema"

export default function OrderList({
  data,
  page,
  search,
}: ListComponentProps<Order>) {
  const { addSlug } = useSlug()
  const orders = data.docs || []
  const totalPages = data.totalPages || 0
  const {
    searchValue,
    changePage,
    handleSearchChange,
    handleSearchClick,
    handleSearchEnter,
  } = usePageUtils()
  const [loading, setLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { showDeleteModal } = useAlertModal()

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<EditOrderData>({
    resolver: zodResolver(editOrderSchema),
  })

  const onEditSubmit = async (data: EditOrderData) => {
    if (!selectedOrder) return

    try {
      const result = await updateOrderAction(selectedOrder.id, {
        status: data.orderStatus,
        paymentStatus: data.paymentStatus,
        trackingId: data.trackingId || "",
      })

      if (result.success) {
        setIsEditOpen(false)
        setSelectedOrder(null)
        reset()
        toast.success("Order updated successfully")
      }
    } catch (error) {
      console.error("Failed to update order:", error)
      toast.error("Failed to update order")
    }
  }

  const handleEdit = (order: Order) => {
    setSelectedOrder(order)
    setValue("orderStatus", order.status)
    setValue("paymentStatus", order.payment?.status || PaymentStatus.NONE)
    setValue("trackingId", order.trackingId || "")
    setIsEditOpen(true)
  }

  const handleView = async (order: Order) => {
    setSelectedOrder(order)
    setIsViewOpen(true)
  }

  const handleDelete = async (order: Order) => {
    showDeleteModal("Product", async () => {
      try {
        const result = await deleteOrderAction(order.id)
        if (result.success) {
          toast.success(result.message)
        }
      } catch (error) {
        console.error("Failed to delete product:", error)
        toast.error("Failed to delete order")
      }
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "completed":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "yellow"
      case OrderStatus.SHIPPED:
        return "blue"
      case OrderStatus.DELIVERED:
        return "green"
      case OrderStatus.CANCELLED:
        return "red"
      case OrderStatus.REFUNDED:
      default:
        return "gray"
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "yellow"
      case PaymentStatus.COMPLETED:
        return "green"
      case PaymentStatus.FAILED:
        return "red"
      case PaymentStatus.REFUNDED:
      default:
        return "gray"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage customer orders and track their status
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {["pending", "processing", "completed", "cancelled"].map((status) => {
          const count = orders.filter((order) => order.status === status).length
          return (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {status} Orders
                </CardTitle>
                <Package className={`h-4 w-4`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>A list of all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.customer?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">
                      {order?.payment?.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(order.status)}
                        color={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(
                          order.payment?.status || PaymentStatus.NONE,
                        )}
                        color={getPaymentStatusColor(
                          order.payment?.status || PaymentStatus.NONE,
                        )}
                      >
                        {order.payment?.status || PaymentStatus.NONE}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.trackingId}</TableCell>
                    <TableCell>{isoToDateString(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          color="green"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(order)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update the order information.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Order No.</Label>
                <span>#{selectedOrder.id}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tracking-id">Tracking ID</Label>
                <Input
                  id="tracking-id"
                  placeholder="Enter tracking ID"
                  {...register("trackingId")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-status">Order Status</Label>
                <Select
                  defaultValue={selectedOrder.status}
                  onValueChange={(value) =>
                    setValue("orderStatus", value as OrderStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((val) => (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.orderStatus && (
                  <p className="text-sm text-red-500">
                    {errors.orderStatus.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Payment Method:</span>{" "}
                  {(selectedOrder?.payment?.paymentMethod || "").toUpperCase()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-status">Payment Status</Label>
                <Select
                  defaultValue={
                    selectedOrder.payment?.status || PaymentStatus.NONE
                  }
                  onValueChange={(value) =>
                    setValue("paymentStatus", value as PaymentStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatuses.map((val) => (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentStatus && (
                  <p className="text-sm text-red-500">
                    {errors.paymentStatus.message}
                  </p>
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
                <Button type="submit">Update Order</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View complete order information.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Order ID</Label>
                  <p className="text-sm text-muted-foreground">
                    #{selectedOrder.id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    variant={getStatusVariant(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status)}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  <Badge
                    variant={getStatusVariant(
                      selectedOrder.payment?.status || PaymentStatus.NONE,
                    )}
                    color={getPaymentStatusColor(
                      selectedOrder.payment?.status || PaymentStatus.NONE,
                    )}
                  >
                    {selectedOrder.payment?.status || PaymentStatus.NONE}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer?.fullName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer?.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedOrder.payment?.paymentMethod}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.notes}
                  </p>
                </div>
              )} */}

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Order Items</Label>
                  <div className="mt-2 border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.productVariant?.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              ${(item.quantity * item.price).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
