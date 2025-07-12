import ImageHolder from "../image-holder/ImageHolder"

export interface AppLogoProps {
  height?: number
  width?: number
  src?: string
}

export default function AppLogo({
  height = 36,
  width = 36,
  src,
}: AppLogoProps) {
  if (src) {
    return <ImageHolder height={height} width={width} radius="full" src={src} />
  }

  return (
    <svg fill="none" height={height} width={width} viewBox="0 0 25 25">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}
