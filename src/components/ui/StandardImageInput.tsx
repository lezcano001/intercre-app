import { Box, FormLabel, VisuallyHiddenInput } from "@chakra-ui/react";
import Image from 'next/image';
import { type ChangeEventHandler } from "react";

interface StandardImageInputProps {
    imageLabel: string;
    name?: string;
    currentImageURL: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

export function StandardImageInput({ imageLabel, currentImageURL, name, onChange }: StandardImageInputProps) {
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
                    src={currentImageURL}
                    alt={imageLabel}
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
                Cambiar Imagen
            </span>
        </FormLabel>
    )
}