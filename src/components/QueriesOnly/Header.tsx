import { Box, Button, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { RiMenuLine } from 'react-icons/ri'
import { useSidebar } from "~/contexts/SidebarContext";
import NextLink from 'next/link'

export function Header() {
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
                    gap-6`}
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
                <Text
                    className="
                        text-lg
                        font-semibold
                        text-gray-600"
                >
                    Interfaz de consultas
                </Text>
                <Button
                    as={NextLink}
                    href="/auth/login"
                    className="
                        ml-auto"
                    colorScheme="orange"
                >
                    Iniciar Sesión
                </Button>
            </Flex>
        </Box>
    )
}