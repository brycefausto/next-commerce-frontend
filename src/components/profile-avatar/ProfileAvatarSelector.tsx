import { ChangeEvent, useRef, useState } from "react"
import ProfileAvatar, { ProfileAvatarProps } from "./ProfileAvatar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CameraIcon } from "lucide-react"

export interface ProfileAvatarSelectorProps extends ProfileAvatarProps {
  src: string
  onChangeFile?: (file: File, url: string) => void
  onDeleteFile?: (image: string) => void
}

export default function ProfileAvatarSelector({
  name,
  baseUrl = "",
  src,
  onChangeFile,
  onDeleteFile,
  ...props
}: ProfileAvatarSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [imagePreview, setImagePreview] = useState(
    (src ? baseUrl + src : "") || "",
  )
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
    if (src) {
      onDeleteFile?.(src)
    }
  }

  return (
    <div className="relative">
      <ProfileAvatar {...props} name={name} src={imagePreview} />
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
              <Button variant="outline" color="red" onClick={handleDelete}>
                Delete Image
              </Button>
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
