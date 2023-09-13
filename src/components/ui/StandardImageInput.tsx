import { Box, FormLabel, VisuallyHiddenInput } from "@chakra-ui/react";
import Image from 'next/image';
import { type ChangeEventHandler } from "react";
import { DEFAULT_USER_IMAGE_URL } from "~/utils/constants";

interface StandardImageInputProps {
    alt: string;
    name?: string;
    imageFile: File | null;
    onChange: ChangeEventHandler<HTMLInputElement>;
    imageURL?: string;
}

export function StandardImageInput({ alt, imageFile, name, onChange, imageURL }: StandardImageInputProps) {
    const currentImageURL = imageFile
        ? URL.createObjectURL(imageFile)
        : imageURL
        ? imageURL
        : DEFAULT_USER_IMAGE_URL

    return (
        <FormLabel
            className="
                cursor-pointer
                rounded-xl
                w-full
                max-w-[13rem]
                h-52
                relative
                overflow-hidden"
        >
            <Box
                className="
                    relative
                    w-full
                    h-full"
            >
                <Image
                    alt={alt}
                    src={currentImageURL}
                    className="
                        absolute"
                    fill
                    style={{
                        objectFit: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </Box>
            <VisuallyHiddenInput
                type="file"
                name={name}
                accept="image/png, image/svg+xml"
                onChange={onChange}
            />
            <span
                className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    flex
                    items-center
                    justify-center
                    bg-green-700
                    text-white
                    h-10
                    font-bold"
            >
                {currentImageURL === DEFAULT_USER_IMAGE_URL ? "Agregar Imagen" : "Cambiar Imagen"}
            </span>
        </FormLabel>
    )
}