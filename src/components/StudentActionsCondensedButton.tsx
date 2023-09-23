import { IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { RiMore2Line } from 'react-icons/ri'
import { DeleteParticipantModal } from "./DeleteParticipantModal";
import { GenerateParticipantCredentialPDFModal } from "./GenerateParticipantCredentialPDFModal";

interface StudentActionsCondensedButtonProps {
    participantCI: string;
    institutionAbbreviation: string;
    participantName: string;
    participantAge: number;
}

export function StudentActionsCondensedButton({
    participantCI,
    institutionAbbreviation,
    participantAge,
    participantName,
} : StudentActionsCondensedButtonProps) {
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
                <MenuItem>
                    Ver
                </MenuItem>
                <MenuItem>
                    Editar
                </MenuItem>
                <GenerateParticipantCredentialPDFModal
                    CI={participantCI}
                    institution={institutionAbbreviation}
                    name={participantName}
                    participantType="STUDENT"
                    age={participantAge}
                    gender={"MALE"}
                    as="MenuItem"
                />
                <DeleteParticipantModal
                    participantCI={participantCI}
                    as="MenuItem"
                />
            </MenuList>
        </Menu>
    )    
}