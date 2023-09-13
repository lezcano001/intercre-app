import { Flex } from "@chakra-ui/react";
import { type ReactNode } from "react"
import { Sidebar } from "../Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Header } from "../Header";

interface DashboardLayoutProps {
    children: ReactNode;
}


// Make the authentication here
export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { status } = useSession()
    const router = useRouter()

    if (status === "unauthenticated") {

        // eslint-disable-next-line
        router.push("/auth/login")
    }

    if (status === "authenticated") {
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
                        w-full"
                >
                    <Header />
                    <Flex
                        className="
                            flex-col
                            w-full
                            p-12
                            overflow-y-scroll"
                    >
                        {children}
                    </Flex>
                </Flex>
            </Flex>
        )
    }

    return null
}