import { IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { RiMore2Line } from "react-icons/ri";

import NextLink from 'next/link'

interface SquadListActionsCondensedButtonProps {
    disciplineId: string;
    institutionISO: number;
}

export function SquadListActionsCondensedButton({
    disciplineId,
    institutionISO
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
                <MenuItem>
                    Imprimir
                </MenuItem>
            </MenuList>
        </Menu>
    )
}