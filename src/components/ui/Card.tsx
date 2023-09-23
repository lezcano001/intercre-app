import { Flex } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
    children: ReactNode;
    className?: HTMLDivElement["className"];
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <Flex
            className={twMerge(`
                p-8
                md:p-12
                bg-white
                sm:shadow-sm
                sm:rounded-xl`, className)}
        >
            { children }
        </Flex>
    )
}