import { VStack } from "@chakra-ui/react";
import { NavItem } from "../ui/NavItem";
import { RiGroupLine, RiPresentationLine, RiRunLine } from "react-icons/ri";

export function Navbar() {
    return (
        <VStack
            as="nav"
            spacing="4"
            className="
                w-full
                mt-10"
        >
            <NavItem
                href="/alumnos"
                icon={RiGroupLine}
            >
                Alumnos
            </NavItem>
            <NavItem
                href="/profesores"
                icon={RiPresentationLine}
            >
                Profesores
            </NavItem>
            <NavItem
                href="/modalidades"
                icon={RiRunLine}
            >
                Modalidades
            </NavItem>
        </VStack>
    )
}