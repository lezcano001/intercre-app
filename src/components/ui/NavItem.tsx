import { Link } from "@chakra-ui/react";
import NextLink from 'next/link'
import { useRouter } from "next/router";
import { type IconType } from "react-icons";

interface NavItemProps {
    children: string;
    icon: IconType;
    href: string;
}

export function NavItem({ children, icon: Icon, href }: NavItemProps) {
    const { asPath } = useRouter()

    return (
        <Link
            as={NextLink}
            href={href}
            className={`
                flex
                gap-5
                !text-white
                !no-underline
                ${asPath.startsWith(href) ? "bg-sky-900 font-semibold" : ""}
                px-8
                py-4
                w-full`}
        >
            <Icon
                className="
                    w-6
                    h-6"
            />
            {children}
        </Link>
    )
}