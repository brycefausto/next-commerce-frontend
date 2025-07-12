"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { settingsSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { RotateCcw, Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  // const { user } = useUserContext()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {},
  })

  // Watch form values for real-time updates
  const watchedValues = watch()

  const onSubmit = async (data: SettingsFormData) => {
    setLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() || "")
      })

      // const result = await updateSettingsAction(formData)
      // if (result.success) {
      //   // updateSettings(data)
      //   setMessage({ type: "success", text: "Settings updated successfully!" })
      // } else {
      //   setMessage({ type: "error", text: result.error || "Failed to update settings" })
      // }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    // resetToDefaults()
    // reset(settings)
    setMessage({ type: "success", text: "Settings reset to defaults" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">
            Configure your system preferences and behavior
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic information about your system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      {...register("siteName")}
                      placeholder="My Inventory System"
                    />
                    {errors.siteName && (
                      <p className="text-sm text-red-500">
                        {errors.siteName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register("contactEmail")}
                      placeholder="admin@example.com"
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    {...register("siteDescription")}
                    placeholder="Describe your system..."
                  />
                  {errors.siteDescription && (
                    <p className="text-sm text-red-500">
                      {errors.siteDescription.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    {...register("contactPhone")}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.contactPhone && (
                    <p className="text-sm text-red-500">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>
                  Configure business-related preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      onValueChange={(value) => setValue("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            watchedValues.currency || "Select currency"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currency && (
                      <p className="text-sm text-red-500">
                        {errors.currency.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      {...register("taxRate", { valueAsNumber: true })}
                      placeholder="8.5"
                    />
                    {errors.taxRate && (
                      <p className="text-sm text-red-500">
                        {errors.taxRate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">
                      Low Stock Threshold
                    </Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      {...register("lowStockThreshold", {
                        valueAsNumber: true,
                      })}
                      placeholder="10"
                    />
                    {errors.lowStockThreshold && (
                      <p className="text-sm text-red-500">
                        {errors.lowStockThreshold.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shop Settings</CardTitle>
                <CardDescription>
                  Configure shop behavior and checkout options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Guest Checkout</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to checkout without creating an account
                      </p>
                    </div>
                    <Switch
                      checked={watchedValues.allowGuestCheckout}
                      onCheckedChange={(checked) =>
                        setValue("allowGuestCheckout", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Phone Number</Label>
                      <p className="text-sm text-muted-foreground">
                        Make phone number mandatory during checkout
                      </p>
                    </div>
                    <Switch
                      checked={watchedValues.requirePhoneNumber}
                      onCheckedChange={(checked) =>
                        setValue("requirePhoneNumber", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Approve Orders</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve new orders
                      </p>
                    </div>
                    <Switch
                      checked={watchedValues.autoApproveOrders}
                      onCheckedChange={(checked) =>
                        setValue("autoApproveOrders", checked)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultOrderStatus">
                      Default Order Status
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("defaultOrderStatus", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            watchedValues.defaultOrderStatus || "Select status"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.emailNotifications}
                    onCheckedChange={(checked) =>
                      setValue("emailNotifications", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when inventory is running low
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.lowStockAlerts}
                    onCheckedChange={(checked) =>
                      setValue("lowStockAlerts", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new orders and status changes
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.orderNotifications}
                    onCheckedChange={(checked) =>
                      setValue("orderNotifications", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Customize how information is displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemsPerPage">Items Per Page</Label>
                    <Input
                      id="itemsPerPage"
                      type="number"
                      {...register("itemsPerPage", { valueAsNumber: true })}
                      placeholder="10"
                    />
                    {errors.itemsPerPage && (
                      <p className="text-sm text-red-500">
                        {errors.itemsPerPage.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultView">Default View</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("defaultView", value as "grid" | "list")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            watchedValues.defaultView || "Select view"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid View</SelectItem>
                        <SelectItem value="list">List View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Out of Stock Items</Label>
                    <p className="text-sm text-muted-foreground">
                      Display products that are out of stock in the shop
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.showOutOfStock}
                    onCheckedChange={(checked) =>
                      setValue("showOutOfStock", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and authentication preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (hours)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      {...register("sessionTimeout", { valueAsNumber: true })}
                      placeholder="24"
                    />
                    {errors.sessionTimeout && (
                      <p className="text-sm text-red-500">
                        {errors.sessionTimeout.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      {...register("maxLoginAttempts", { valueAsNumber: true })}
                      placeholder="5"
                    />
                    {errors.maxLoginAttempts && (
                      <p className="text-sm text-red-500">
                        {errors.maxLoginAttempts.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce strong password requirements for new users
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.requireStrongPasswords}
                    onCheckedChange={(checked) =>
                      setValue("requireStrongPasswords", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}
