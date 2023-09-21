import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, VStack, useMediaQuery } from "@chakra-ui/react";
import { Logotype } from "./Logotype";
import { NavItem } from "./ui/NavItem";
import { RiBookLine, RiGroupLine } from 'react-icons/ri'
import { useSidebar } from "~/contexts/SidebarContext";
import { useEffect } from "react";

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
                <VStack
                    spacing="4"
                    className="
                        mt-10
                        w-full"
                >
                    <NavItem
                        href="/participantes"
                        icon={RiGroupLine}
                    >
                        Participantes
                    </NavItem>
                    <NavItem
                        href="/inscripciones"
                        icon={RiBookLine}
                    >
                        Inscripciones
                    </NavItem>
                </VStack>
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
                    <VStack
                        spacing="4"
                        className="
                            w-full
                            mt-10"
                    >
                        <NavItem
                            href="/participantes"
                            icon={RiGroupLine}
                        >
                            Participantes
                        </NavItem>
                        <NavItem
                            href="/inscripciones"
                            icon={RiBookLine}
                        >
                            Inscripciones
                        </NavItem>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}