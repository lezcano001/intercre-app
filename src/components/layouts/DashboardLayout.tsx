import { Flex, useMediaQuery } from "@chakra-ui/react";
import { type ReactNode } from "react"
import { Sidebar } from "../Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Header } from "../Header";
import { SidebarContextProvider } from "~/contexts/SidebarContext";

interface DashboardLayoutProps {
    children: ReactNode;
}


// Make the authentication here
export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { status } = useSession()
    const router = useRouter()

    const [isLargerThan768] = useMediaQuery("(min-width: 768px)")

    if (status === "unauthenticated") {

        // eslint-disable-next-line
        router.push("/auth/login")
    }

    if (status === "authenticated") {
        return (
            <SidebarContextProvider>
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
                            className={`
                                flex-col
                                w-full
                                py-12
                                ${isLargerThan768 ? 'px-12' : 'px-8'}
                                overflow-y-scroll`}
                        >
                            {children}
                        </Flex>
                    </Flex>
                </Flex>
            </SidebarContextProvider>
        )
    }

    return null
}