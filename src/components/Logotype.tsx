import { Link } from "@chakra-ui/react";
import NextLink from 'next/link'

export function Logotype() {
    return (
        <Link
            as={NextLink}
            className="
                text-xl
                font-bold
                !text-white
                !no-underline
                block
                text-center
                mx-auto
                py-8"
            href="/"
        >
            INTERCRECE 2023
        </Link>
    )
}