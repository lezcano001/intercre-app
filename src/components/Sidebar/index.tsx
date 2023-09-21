import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, useMediaQuery } from "@chakra-ui/react";
import { Logotype } from "../Logotype";
import { useSidebar } from "~/contexts/SidebarContext";
import { useEffect } from "react";
import { Navbar } from "./Navbar";

export function Sidebar() {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')

    const { isOpen, onClose } = useSidebar()

    useEffect(() => {
        onClose()
        
    // eslint-disable-next-line
    }, [isLargerThan768])

    if (isLargerThan768) {
        return (
            <Flex
                className="
                    max-w-[18rem]
                    w-full
                    h-full
                    bg-sky-800
                    flex-col"
            >
                <Flex
                    className="
                        w-full
                        justify-center
                        bg-white
                        h-20
                        py-2
                        border-b-[1px]
                        border-b-slate-200
                        border-r-[1px]
                        border-r-slate-200"
                >
                    <Logotype
                        className="
                            h-full"
                    />
                </Flex>
                <Navbar />
            </Flex>
        )
    }

    return (
        <Drawer
            placement="left"
            onClose={onClose}
            isOpen={isOpen}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader
                    className="
                        flex
                        justify-center
                        bg-white
                        !px-14
                        !py-0"
                >
                    <DrawerCloseButton
                        className="
                            text-red-450"
                    />
                    <Flex
                        className="
                        w-full
                        justify-center
                        h-20
                        py-2
                        border-b-[1px]
                        border-b-slate-200"
                    >
                        <Logotype
                            className="
                                h-full"
                        />
                    </Flex>
                </DrawerHeader>
                <DrawerBody
                    className="
                        bg-sky-800
                        !px-0"
                >
                    <Navbar />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}