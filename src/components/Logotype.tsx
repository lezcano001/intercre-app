import { Link } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from 'next/link'
import { twMerge } from "tailwind-merge";

const LOGOTYPE_VARIANTS_MAP = {
    normal: '/logotype.png',
    variant1Negative: '/logotype-negative-variant-1.png',
}

interface LogotypeProps {
    variant?: keyof typeof LOGOTYPE_VARIANTS_MAP;
    className?: HTMLAnchorElement["className"];
}

export function Logotype({ variant = "normal", className = "" }: LogotypeProps) {
    return (
        <Link
            as={NextLink}
            className={twMerge(`
                w-full
                relative
                h-20`, className)}
            href="/"
        >
            {/* INTERCRECE 2023 */}
            <Image
                src={LOGOTYPE_VARIANTS_MAP[variant]}
                alt="Logotipo"
                fill
                style={{
                    objectFit: 'contain'
                }}
            />
        </Link>
    )
}