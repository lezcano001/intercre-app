import Image, { type ImageProps } from "next/image";
import { useState } from "react";


interface ImageWithFallback extends ImageProps {
    fallbackSrc: string;
}

export function ImageWithFallback({
    fallbackSrc,
    src,
    alt,
    ...rest
}: ImageWithFallback) {
    const [error, setError] = useState(false)
    return (
        <Image
            src={error ? fallbackSrc : src}
            onError={() =>  {
                setError(true)
            }}
            alt={alt}
            {...rest}
        />
    )
}