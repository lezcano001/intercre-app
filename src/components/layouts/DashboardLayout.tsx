import { Flex } from "@chakra-ui/react";
import { type ReactNode } from "react"
import { Sidebar } from "../Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <Flex
            className="
                w-full
                h-screen
                bg-gray-100"
        >
            <Sidebar />
            <Flex
                className="
                    flex-col
                    w-full
                    p-12"
            >
                {children}
            </Flex>
        </Flex>
    )
}