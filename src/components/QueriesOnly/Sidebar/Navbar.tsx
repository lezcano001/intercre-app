import { VStack } from "@chakra-ui/react";
import { NavItem } from "../../ui/NavItem";
import { RiGroupLine } from "react-icons/ri";

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
                href={"/consultas/participantes"}
                icon={RiGroupLine}
            >
                Participantes
            </NavItem>
        </VStack>
    )
}