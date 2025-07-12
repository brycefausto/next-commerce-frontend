import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CameraIcon } from "lucide-react"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../ui/button"
import ImageHolder, { ImageHolderProps } from "./ImageHolder"

export interface ImageSelectorProps extends ImageHolderProps {
  baseUrl: string
  image?: string
  required?: boolean
  file?: File
  onChangeFile?: (file: File, url: string) => void
  onDeleteFile?: (image: string) => void
}

export default function ImageSelector({
  src,
  baseUrl,
  image,
  required,
  file: fileProp,
  onChangeFile,
  onDeleteFile,
  ...props
}: ImageSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const imageUrl = useMemo(
    () => (image ? baseUrl + image : src) || "",
    [image, baseUrl, src],
  )
  const [imagePreview, setImagePreview] = useState(
    (image ? baseUrl + image : src) || "",
  )

  useEffect(() => setImagePreview(imageUrl), [imageUrl])
  useEffect(() => {
    if (fileProp) {
      const fileUrl = URL.createObjectURL(fileProp)
      setImagePreview(fileUrl)
    } else {
      setImagePreview(imageUrl)
    }
  }, [fileProp])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files.length) {
      const file = files[0]
      const fileUrl = URL.createObjectURL(file)
      setImagePreview(fileUrl)
      onChangeFile?.(file, fileUrl)
    }
    buttonRef.current?.click()
  }
  const handleDelete = () => {
    setImagePreview("")
    if (image) {
      onDeleteFile?.(image)
    }
  }

  return (
    <div className="group relative" style={{ maxWidth: props.width }}>
      <ImageHolder src={imagePreview} {...props} />
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            variant="ghost"
            size="icon"
          >
            <CameraIcon className="h-4 w-4" />
            <span className="sr-only">Change Image</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px]" side="bottom">
          <div className="px-1 py-2 w-full">
            <div className="mt-2 flex flex-col gap-2 w-full">
              <Button onClick={() => inputRef.current?.click()}>
                Choose Image
              </Button>
              {!required && (image || imagePreview) && (
                <Button variant="outline" color="red" onClick={handleDelete}>
                  Delete Image
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <input
        key={imagePreview}
        className="hidden"
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/*"
      />
    </div>
  )
}
