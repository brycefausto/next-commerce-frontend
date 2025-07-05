import { cn } from "@/lib/utils"

function Skeleton({
  className,
  children,
  loading,
  ...props
}: React.ComponentProps<"div"> & { loading?: boolean }) {
  if (!loading) {
    return children;
  }

  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Skeleton }
