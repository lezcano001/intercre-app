import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useMediaQuery } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { RiLogoutBoxRLine, RiMenuLine } from 'react-icons/ri'
import { useSidebar } from "~/contexts/SidebarContext";

export function Header() {
    const { data: session } = useSession()

    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')

    const { onOpen } = useSidebar()

    return (
        <Box
            as="header"
            className={`
                w-full
                max-h-[5rem]
                h-full
                ${isLargerThan900 ? 'px-12' : 'px-8'}
                bg-white
                border-b-[1px]
                border-b-slate-200`}
        >
            <Flex
                className={`
                    h-full
                    w-full
                    items-center
                    ${isLargerThan900 ? 'justify-end' : 'justify-between'}`}
            >
                {!isLargerThan900 ? (
                    <Button
                        onClick={onOpen}
                    >
                        <RiMenuLine
                            className="
                                w-6
                                h-6"
                        />
                    </Button>
                ) : null}
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
                                gap-3
                                md:gap-5
                                text-sm
                                md:text-base
                                sm:border-l-[1px]
                                sm:border-l-gray-300
                                sm:pl-8"
                        >
                            <Flex
                                className="
                                    flex-col
                                    items-start"
                            >
                                <Text
                                    className="
                                        font-semibold
                                        whitespace-nowrap
                                        max-w-[8rem]
                                        min-[450px]:max-w-none
                                        overflow-hidden
                                        overflow-ellipsis"
                                >
                                    {session?.user.name}
                                </Text>
                                <Text>
                                    {session?.user.institutionAbbreviation}
                                </Text>
                            </Flex>
                            <Avatar
                                size={isLargerThan900 ? "md" : "sm"}
                            />
                        </Flex>
                    </MenuButton>
                    <MenuList
                        className="
                            w-[16rem]
                            md:w-[20rem]
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