import { FC } from "react";
import NextHead from "next/head";

interface HeadProps {
  title: string;
  description?: string;
}

const Head: FC<HeadProps> = ({ title, description }) => {
  return (
    <>
      <NextHead>
        <title>{title || "PongChamp"}</title>
        <meta name="description" content={description || "Ping pong game platform"} />
        <link rel="icon" href="/images/brand/favicon.ico" />
      </NextHead>
    </>
  );
};

export default Head;
