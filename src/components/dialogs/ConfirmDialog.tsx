import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

export interface ConfirmDialogProps {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void
  onCancel?: () => void
}

export function ConfirmDialog({ title, description, open, onOpenChange, onConfirm, onCancel }: ConfirmDialogProps) {
  const handleOnCancel = () => {
    onOpenChange(false)
    onCancel?.()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleOnCancel}>{!!onConfirm ? 'Cancel' : 'Close'}</AlertDialogCancel>
          {!!onConfirm && (
            <AlertDialogAction
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              Confirm
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
