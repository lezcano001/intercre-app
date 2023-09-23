import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, useMediaQuery } from "@chakra-ui/react";
import { Logotype } from "../Logotype";
import { useSidebar } from "~/contexts/SidebarContext";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { CRECELogotype } from "../CRECELogotype";

export function Sidebar() {
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')

    const { isOpen, onClose } = useSidebar()

    useEffect(() => {
        onClose()
        
    // eslint-disable-next-line
    }, [isLargerThan900])

    if (isLargerThan900) {
        return (
            <Flex
                className="
                    min-w-[18rem]
                    h-full
                    bg-sky-800
                    flex-col"
            >
                <Flex
                    className="
                        w-full
                        justify-between
                        bg-white
                        h-20
                        py-2
                        px-6
                        border-b-[1px]
                        border-b-slate-200
                        border-r-[1px]
                        border-r-slate-200"
                >
                    <CRECELogotype
                        className="
                            h-full"
                    />
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
                        bg-white
                        !py-0
                        !px-0"
                >
                    <DrawerCloseButton
                        className="
                            text-red-450"
                    />
                    <Flex
                        className="
                        w-full
                        justify-between
                        h-20
                        py-2
                        px-8
                        border-b-[1px]
                        border-b-slate-200"
                    >
                        <CRECELogotype
                            className="
                                h-full"
                        />
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