import { FC } from "react";
import styled from "styled-components";
import GroupDefaultAvatar from "@/components/GroupDefaultAvatar";
import Link from "next/link";
import Image from "next/image";
import { useSocket } from "@/src/context/socket";

interface AvatarProps {
  src?: string | undefined;
  size?: number;
  alt?: string;
  radius?: number;
  username?: string;
  link?: boolean;
}

interface StyleProps {
  size: number;
  radius: number;
  status?: "online" | "offline" | "inGame";
}

const Avatar: FC<AvatarProps> = ({
  src = undefined,
  alt = "",
  size = 50,
  radius = size,
  username,
  link = true,
}) => {
  const { getStatus } = useSocket();

  return !src ? (
    <GroupDefaultAvatar size={size} />
  ) : (
    <Style
      size={size}
      radius={radius}
      status={username ? getStatus(username) : undefined}
      className="avatar"
    >
      {link ? (
        <Link href={`/${username?.toLowerCase()}`}>
          <Image src={src} alt={alt} width={size} height={size} />
        </Link>
      ) : (
        <Image src={src} alt={alt} width={size} height={size} />
      )}
    </Style>
  );
};
export default Avatar;

const Style = styled.figure<StyleProps>`
  display: inline-block;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  min-width: ${(p) => p.size}px;
  max-width: ${(p) => p.size}px;
  min-height: ${(p) => p.size}px;
  max-height: ${(p) => p.size}px;
  border-radius: ${(p) => p.radius}px;
  background-color: #111331;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    width: ${(p) => (p.size > 70 ? "14" : "12")}px;
    height: ${(p) => (p.size > 70 ? "14" : "12")}px;
    border-radius: 50%;
    bottom: ${(p) => (p.size > 70 ? "5" : "0")}px;
    right: ${(p) => (p.size > 70 ? "5" : "0")}px;

    ${({ status }) => status && "border: 2px solid #111331"};
    background-color: ${({ status }) => {
      switch (status) {
        case "online":
          return "#43FF83";
        case "inGame":
          return "#E17A00";
        case "offline":
          return "#847E9D";
        default:
          return "transparent";
      }
    }};
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: ${(p) => p.radius}px;
  }
  a {
    height: 100%;
    width: 100%;
    :focus-within {
      box-shadow: none;
    }
  }
`;
