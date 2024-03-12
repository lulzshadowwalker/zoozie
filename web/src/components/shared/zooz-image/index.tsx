/* eslint-disable jsx-a11y/alt-text */
import { Config } from "@/lib/config";
import Image, { ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "src"> {
  src: string;
}

/**
 * wrapper components around next/image that provides blur placeholders for remote and non-staically imported local image
 *
 * NOTE: default next/image can be used for generating blur placeholders for statically imported images
 *
 * NOTE: it returns default next/image when running in development
 */
export default function ZoozImage({ src, ...rest }: Props) {
  if (typeof window !== "undefined" || Config.environment === "development") {
    return <Image src={src} {...rest} />;
  }

  return <ServerImage src={src} {...rest} />;
}

async function ServerImage({ src, ...rest }: Props) {
  if (typeof window !== "undefined") {
    throw new Error("blur placeholders should only be used on the server");
  }

  try {
    const url = new URL("/api/placeholders", Config.baseUrl);
    url.searchParams.set("src", src);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `cannot generate placeholder because status ${res.status}`,
      );
    }

    const { base64 } = await res.json().then((payload) => payload.data);

    return (
      <Image src={src} placeholder="blur" blurDataURL={base64} {...rest} />
    );
  } catch (e) {
    console.error("failure generating placeholder image because ", e);
    return <Image src={src} {...rest} />;
  }
}
