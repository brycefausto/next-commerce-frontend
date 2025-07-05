"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      color: {
        default: "",
        blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        green: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        red: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        yellow: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400",
        purple: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
        pink: "bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500",
        indigo: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        gray: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        orange: "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500",
        teal: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
    },
  },
)

// Color-specific outline variants
const outlineColorVariants = {
  blue: "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  green: "border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
  red: "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
  yellow: "border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white",
  purple: "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
  pink: "border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white",
  indigo: "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
  gray: "border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white",
  orange: "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white",
  teal: "border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white",
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Handle outline variant with colors
    const isOutlineWithColor = variant === "outline" && color && color !== "default"
    const outlineColorClass = isOutlineWithColor ? outlineColorVariants[color as keyof typeof outlineColorVariants] : ""

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            color: variant === "outline" && color !== "default" ? "default" : color,
            size,
            className,
          }),
          isOutlineWithColor && outlineColorClass,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
