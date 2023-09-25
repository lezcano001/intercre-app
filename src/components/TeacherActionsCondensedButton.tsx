import { IconButton, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { RiMore2Line } from "react-icons/ri";
import { DeleteParticipantModal } from "./DeleteParticipantModal";

interface TeacherActionsCondensedButtonProps {
    participantCI: string;
}

export function TeacherActionsCondensedButton({
    participantCI
}: TeacherActionsCondensedButtonProps) {
    return (
        <Menu>
            <MenuButton
                as={IconButton}
                icon={
                    <RiMore2Line
                        className="
                            w-4
                            h-4"
                    />
                }
                aria-label="Más acciones"
                size="sm"
            >
                <Text
                    className="
                        font-semibold"
                >
                    Acciones
                </Text>
            </MenuButton>
            <MenuList>
                <DeleteParticipantModal
                    participantCI={participantCI}
                    as="MenuItem"
                />
            </MenuList>
        </Menu>
    )
}