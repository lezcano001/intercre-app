import { Flex } from "@chakra-ui/react";
import { SidebarContextProvider } from "~/contexts/SidebarContext";
import { Sidebar } from "../QueriesOnly/Sidebar";
import { Header } from "../QueriesOnly/Header";
import { type ReactNode } from "react";

interface QueriesOnlyDashboardLayoutProps {
    children: ReactNode;
}

export function QueriesOnlyDashboardLayout({ children }: QueriesOnlyDashboardLayoutProps) {
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