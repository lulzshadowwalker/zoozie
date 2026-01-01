/* eslint-disable jsx-a11y/alt-text */
import Image, { ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "src"> {
  src: string;
}

export default function ZoozImage({ src, ...rest }: Props) {
  return <Image src={src} {...rest} />;
}
