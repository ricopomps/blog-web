import profilePicPlaceholder from "@/assets/images/profile-pic-placeholder.png";
import Image, { ImageProps } from "next/image";

interface ProfileImageProps {
  src?: string;
  alt?: string;
}

export default function ProfileImage({
  src,
  alt,
  ...props
}: ProfileImageProps & Omit<ImageProps, "src" | "alt">) {
  return (
    <Image
      {...props}
      src={src || profilePicPlaceholder}
      alt={alt || "User profile picture"}
      width={props.width || 40}
      height={props.height || 40}
      className={props.className || "rounded-circle"}
    />
  );
}
