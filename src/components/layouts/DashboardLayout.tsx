import { Flex } from "@chakra-ui/react";
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
                        bg:white
                        sm:bg-gray-100"
                >
                    <Sidebar />
                    <Flex
                        className={`
                            flex-col
                            w-full
                            min-[900px]:max-w-[calc(100%-18rem)]`}
                    >
                        <Header />
                        <Flex
                            className={`
                                w-full
                                flex-col
                                sm:p-8
                                min-[900px]:p-12
                                overflow-y-auto`}
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