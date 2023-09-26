import { IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { RiMore2Line } from "react-icons/ri";

import NextLink from 'next/link'
import { GenerateSquadListPDF } from "./GenerateSquadListPDF";

interface SquadListActionsCondensedButtonProps {
    disciplineId: string;
    institutionISO: number;
    institutionName: string;
    category: string;
}

export function SquadListActionsCondensedButton({
    disciplineId,
    institutionISO,
    institutionName,
    category
}: SquadListActionsCondensedButtonProps) {
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
                <MenuItem
                    as={NextLink}
                    href={"/modalidades/" + disciplineId + "/" + institutionISO}
                >
                    Editar
                </MenuItem>
                <GenerateSquadListPDF
                    category={category}
                    as="MenuItem"
                    disciplineId={disciplineId}
                    institutionISO={institutionISO}
                    institutionName={institutionName}
                />
            </MenuList>
        </Menu>
    )
}