"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        soft: "border-transparent",
      },
      color: {
        default: "",
        blue: "",
        green: "",
        red: "",
        yellow: "",
        purple: "",
        pink: "",
        indigo: "",
        gray: "",
        orange: "",
        teal: "",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
    },
  },
)

// Color-specific styles for different variants
const colorStyles = {
  blue: {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border-blue-600 text-blue-600 hover:bg-blue-50",
    soft: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  green: {
    solid: "bg-green-600 text-white hover:bg-green-700",
    outline: "border-green-600 text-green-600 hover:bg-green-50",
    soft: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  red: {
    solid: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-red-600 text-red-600 hover:bg-red-50",
    soft: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  yellow: {
    solid: "bg-yellow-500 text-white hover:bg-yellow-600",
    outline: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    soft: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  purple: {
    solid: "bg-purple-600 text-white hover:bg-purple-700",
    outline: "border-purple-600 text-purple-600 hover:bg-purple-50",
    soft: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  },
  pink: {
    solid: "bg-pink-600 text-white hover:bg-pink-700",
    outline: "border-pink-600 text-pink-600 hover:bg-pink-50",
    soft: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  },
  indigo: {
    solid: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    soft: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  },
  gray: {
    solid: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border-gray-600 text-gray-600 hover:bg-gray-50",
    soft: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  orange: {
    solid: "bg-orange-600 text-white hover:bg-orange-700",
    outline: "border-orange-600 text-orange-600 hover:bg-orange-50",
    soft: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  teal: {
    solid: "bg-teal-600 text-white hover:bg-teal-700",
    outline: "border-teal-600 text-teal-600 hover:bg-teal-50",
    soft: "bg-teal-100 text-teal-800 hover:bg-teal-200",
  },
}

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">, VariantProps<typeof badgeVariants> {
  dismissible?: boolean
  onDismiss?: () => void
  dot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, color, size, dismissible, onDismiss, dot, children, ...props }, ref) => {
    // Determine the color style based on variant and color
    const getColorClass = () => {
      if (!color || color === "default") return ""

      const colorStyle = colorStyles[color as keyof typeof colorStyles]
      if (!colorStyle) return ""

      switch (variant) {
        case "outline":
          return colorStyle.outline
        case "soft":
          return colorStyle.soft
        default:
          return colorStyle.solid
      }
    }

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), getColorClass(), dot && "pl-1.5", className)}
        {...props}
      >
        {dot && (
          <div
            className={cn("w-2 h-2 rounded-full mr-1.5", color && color !== "default" ? `bg-current` : "bg-current")}
          />
        )}
        {children}
        {dismissible && (
          <button
            onClick={onDismiss}
            className="ml-1.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
            aria-label="Remove badge"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  },
)
Badge.displayName = "Badge"

// Demo component to showcase the badge
export default function Component() {
  const [badges, setBadges] = React.useState([
    { id: 1, text: "React", color: "blue" },
    { id: 2, text: "TypeScript", color: "indigo" },
    { id: 3, text: "Tailwind", color: "teal" },
  ])

  const colors = [
    "default",
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "gray",
    "orange",
    "teal",
  ] as const

  const sizes = ["sm", "default", "lg", "xl"] as const

  const removeBadge = (id: number) => {
    setBadges(badges.filter((badge) => badge.id !== id))
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Customizable Badge Component</h1>
        <p className="text-gray-600">
          A flexible badge component perfect for status indicators, tags, labels, and notifications.
        </p>
      </div>

      {/* Color Variants - Solid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Solid Color Options</h2>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <Badge key={color} color={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Outline Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Outline Variants</h2>
        <div className="flex flex-wrap gap-3">
          {colors.slice(1).map((color) => (
            <Badge key={color} variant="outline" color={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Soft Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Soft Variants</h2>
        <div className="flex flex-wrap gap-3">
          {colors.slice(1).map((color) => (
            <Badge key={color} variant="soft" color={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Size Options</h2>
        <div className="flex items-center gap-3">
          {sizes.map((size) => (
            <Badge key={size} size={size} color="purple">
              {size === "default" ? "Default" : size.toUpperCase()}
            </Badge>
          ))}
        </div>
      </div>

      {/* Status Indicators with Dots */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Status Indicators</h2>
        <div className="flex flex-wrap gap-3">
          <Badge color="green" dot>
            Online
          </Badge>
          <Badge color="yellow" dot>
            Away
          </Badge>
          <Badge color="red" dot>
            Offline
          </Badge>
          <Badge color="blue" dot>
            In Meeting
          </Badge>
          <Badge color="purple" dot>
            Do Not Disturb
          </Badge>
        </div>
      </div>

      {/* Dismissible Tags */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dismissible Tags</h2>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge
              key={badge.id}
              color={badge.color as any}
              variant="soft"
              dismissible
              onDismiss={() => removeBadge(badge.id)}
            >
              {badge.text}
            </Badge>
          ))}
        </div>
        {badges.length === 0 && <p className="text-gray-500 italic">All tags have been removed!</p>}
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium">Project Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Frontend:</span>
                <Badge color="green" size="sm">
                  Complete
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Backend:</span>
                <Badge color="yellow" size="sm">
                  In Progress
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Testing:</span>
                <Badge color="red" size="sm">
                  Pending
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">User Roles</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">John Doe:</span>
                <Badge color="purple" variant="soft" size="sm">
                  Admin
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Jane Smith:</span>
                <Badge color="blue" variant="soft" size="sm">
                  Editor
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Bob Wilson:</span>
                <Badge color="gray" variant="soft" size="sm">
                  Viewer
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Messages</span>
                <Badge color="red" size="sm">
                  3
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Updates</span>
                <Badge color="blue" size="sm">
                  12
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" color="teal" size="sm">
                Design
              </Badge>
              <Badge variant="outline" color="orange" size="sm">
                Development
              </Badge>
              <Badge variant="outline" color="pink" size="sm">
                Marketing
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Code Examples</h2>
        <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-2">
          <div>{'<Badge color="green">Success</Badge>'}</div>
          <div>{'<Badge variant="outline" color="blue">Info</Badge>'}</div>
          <div>{'<Badge variant="soft" color="yellow">Warning</Badge>'}</div>
          <div>{'<Badge color="red" dot>Error Status</Badge>'}</div>
          <div>{"<Badge dismissible onDismiss={handleRemove}>Tag</Badge>"}</div>
        </div>
      </div>
    </div>
  )
}

export { Badge, badgeVariants }
