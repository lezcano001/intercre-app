import { Flex, VStack } from "@chakra-ui/react";
import { Logotype } from "./Logotype";
import { NavItem } from "./ui/NavItem";
import { RiGroupLine } from 'react-icons/ri'

export function Sidebar() {
    return (
        <Flex
            className="
                max-w-[18rem]
                w-full
                h-full
                bg-sky-800
                flex-col"
        >
            <Logotype />
            <VStack
                spacing="4"
                className="
                    w-full"
            >
                <NavItem
                    href="/participantes"
                    icon={RiGroupLine}
                >
                    Participantes
                </NavItem>
            </VStack>
        </Flex>
    )
}