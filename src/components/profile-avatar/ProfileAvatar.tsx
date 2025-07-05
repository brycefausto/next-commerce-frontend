import { getInitials } from "@/lib/stringUtils";
import { AvatarImageProps } from "@radix-ui/react-avatar";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export interface ProfileAvatarProps extends AvatarImageProps {
  baseUrl?: string;
  name?: string;
  size?: number;
}

const DEFAULT_PROFILE_IMAGE = "/images/avatar_placeholder.png";

export default function ProfileAvatar({
  name,
  baseUrl = "",
  src,
  size,
  ...props
}: ProfileAvatarProps) {
  const imageSrc = useMemo(
    () => (src ? baseUrl + src : DEFAULT_PROFILE_IMAGE),
    [src]
  );
  const initials = useMemo(() => getInitials(name || ""), [name]);
  const [loading, setLoading] = useState(true);

  return (
    <Skeleton loading={loading}>
      <Avatar className={cn(size && `size-[${size}px]`)}>
        <AvatarImage src={imageSrc} onLoad={() => setLoading(false)} {...props} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </Skeleton>
  );
}
