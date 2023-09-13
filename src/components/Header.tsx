import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { RiLogoutBoxRLine } from 'react-icons/ri'

export function Header() {
    const { data: session } = useSession()

    return (
        <Box
            as="header"
            className="
                w-full
                h-20
                px-12
                bg-white
                border-b-[1px]
                border-b-slate-200"
        >
            <Flex
                className="
                    h-full
                    w-full
                    items-center
                    justify-end"
            >
                <Menu>
                    <MenuButton
                        as={Button}
                        variant="unstyled"
                        className="
                            !h-full"
                    >
                        <Flex
                            className="
                                font-normal
                                flex
                                items-center
                                gap-5"
                        >
                            {session?.user.name}
                            <Avatar />
                        </Flex>
                    </MenuButton>
                    <MenuList
                        className="
                            w-[20rem]
                            !text-gray-600"
                    >
                        <MenuItem
                            className="
                                !h-14"
                            onClick={() => {
                                void signOut()
                            }}
                        >
                            <Flex
                                className="
                                    px-4
                                    w-full
                                    items-center
                                    gap-5"
                            >
                                <RiLogoutBoxRLine
                                    className="
                                        w-6
                                        h-6"
                                />
                                Cerrar Sesión
                            </Flex>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    )
}