import Image, { ImageProps } from "next/image"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"

const placeholder = "/images/placeholder.svg"

export type ImageHolderProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string
  alt?: string
  radius?: string | number
}

export default function ImageHolder({
  src: srcProp,
  alt,
  radius,
  width,
  height,
  ...props
}: ImageHolderProps) {
  const [src, setSrc] = useState(srcProp || placeholder)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (srcProp !== src) {
      setSrc(srcProp || placeholder)
    }
  }, [srcProp])

  return (
    <Skeleton loading={loading}>
      <Image
        src={src}
        blurDataURL={placeholder}
        alt={alt || ""}
        width={width}
        height={height}
        {...props}
        style={{ borderRadius: radius || "none" }}
        onError={() => setSrc(placeholder)}
        onLoad={() => setLoading(false)}
      />
    </Skeleton>
  )
}
