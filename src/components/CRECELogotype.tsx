import { Link } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from 'next/link'
import { twMerge } from "tailwind-merge";

interface LogotypeProps {
    className?: HTMLAnchorElement["className"];
    href?: string;
}

export function CRECELogotype({ className = "", href }: LogotypeProps) {
    return (
        <Link
            as={NextLink}
            className={twMerge(`
                relative
                h-20
                w-20`, className)}
            href={href ?? "/"}
        >
            <Image
                priority={true}
                src={"/crece-logotype.png"}
                alt="Logotipo del CRECE"
                fill
                style={{
                    objectFit: 'contain'
                }}
            />
        </Link>
    )
}