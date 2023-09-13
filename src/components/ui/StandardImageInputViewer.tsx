import { Box } from "@chakra-ui/react";
import { ImageWithFallback } from "./ImageWithFallback";
import { DEFAULT_USER_IMAGE_URL } from "~/utils/constants";

interface StandardImageInputViewerProps {
    alt: string;
    src: string;
}

export function StandardImageInputViewer ({ alt, src }: StandardImageInputViewerProps) {
    return (
        <Box
            className="
                rounded-xl
                relative
                w-full
                max-w-[13rem]
                h-52
                overflow-hidden"
        >
            <ImageWithFallback
                alt={alt}
                fallbackSrc={DEFAULT_USER_IMAGE_URL}
                src={src}
                className="
                    absolute"
                fill
                style={{
                    objectFit: 'cover',
                    backgroundPosition: 'center'
                }}
            />
        </Box>
    )
} 