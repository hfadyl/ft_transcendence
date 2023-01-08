import { FC, ChangeEvent, useState, useEffect } from "react";
import styled from "styled-components";
import { Camera } from "react-iconly";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/src/context/auth";

interface AvatarProps {
  src?: string | undefined;
  size?: number;
  alt?: string;
}

const AvatarUpload: FC<AvatarProps> = ({ src = "", alt = "", size = 50 }) => {
  const { user, setAvatar } = useAuth();
  const [image, setImage] = useState<string | "">(user?.avatar || src);

  useEffect(() => {
    setImage(user?.avatar || "");
  }, [user]);

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) return;
    if (file.size > 1024 * 1024) return toast.error("Image size too large");
    if (file.type !== "image/jpeg" && file.type !== "image/png")
      return toast.error("Image format is incorrect");
    const formData = new FormData();
    formData.append("picture", e.target.files![0]);
    await axios
      .post(`${process.env.USERS}/uploadAvatar`, formData, { withCredentials: true })
      .then(() => {
        setImage(URL.createObjectURL(file));
        setAvatar(URL.createObjectURL(file));
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  return (
    <Style size={size} encType="multipart/form-data" className="avatar">
      <input
        type="file"
        id="avatar-upload"
        name="avatar"
        accept="image/png, image/jpeg"
        onChange={uploadImage}
      />
      <label htmlFor="avatar-upload">
        <Camera set="bulk" />
        {image && <Image src={image} alt={alt} width={size} height={size} />}
      </label>
    </Style>
  );
};
export default AvatarUpload;

const Style = styled.form<{ size: number }>`
  display: inline-block;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  min-width: ${(p) => p.size}px;
  max-width: ${(p) => p.size}px;
  min-height: ${(p) => p.size}px;
  max-height: ${(p) => p.size}px;
  background-color: #1f1a34;
  overflow: hidden;
  position: relative;
  border-radius: 42% 56% 72% 28% / 42% 42% 56% 48%;
  animation: morph 3.75s linear infinite;
  input {
    display: none;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    opacity: 0;
  }
  label {
    cursor: pointer;
    width: 100%;
    height: 100%;
    :hover {
      img {
        opacity: 0.2;
        transition: opacity 0.2s ease-in-out;
      }
      svg {
        opacity: 1;
      }
    }
  }
  img {
    transition: opacity 0.2s ease-in-out;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  @keyframes morph {
    0%,
    100% {
      border-radius: 42% 56% 72% 28% / 42% 42% 56% 48%;
    }
    33% {
      border-radius: 72% 28% 48% 48% / 28% 28% 72% 72%;
    }
    66% {
      border-radius: 100% 56% 56% 100% / 100% 100% 56% 56%;
    }
  }
`;
