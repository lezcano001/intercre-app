import { Button, Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { TRPCError } from "@trpc/server";

import NextLink from 'next/link'
import { api } from "~/utils/api";

export function SquadsTable() {
    const disciplines = api.disciplines.getAll.useQuery()

    if (disciplines?.data instanceof TRPCError) {
        return (
            <Flex>
                {disciplines.data.message}
            </Flex>
        )
    }

    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>DEPORTE</Th>
                        <Th>CATEGORÍA</Th>
                        <Th
                            isNumeric
                        >
                            ACCIONES
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {disciplines.isFetching ? (
                        <Tr>
                            <Td
                                colSpan={4}
                            >
                                <Flex
                                    className="
                                        py-12
                                        w-full
                                        justify-center
                                        gap-6
                                        text-gray-600"
                                >
                                    <Text>Cargando Listas de Buena Fe</Text>
                                    <Spinner />
                                </Flex>
                            </Td>
                        </Tr>
                    ) : (
                        disciplines?.data && disciplines.data.length > 0 ? disciplines.data.map(discipline => (
                            <Tr
                                key={discipline.disciplineId}
                            >
                                <Td>
                                    {discipline.name}
                                </Td>
                                <Td>
                                    {discipline.genreCategory}
                                </Td>
                                <Td
                                    isNumeric
                                >
                                    <Flex
                                        className="
                                            gap-2.5
                                            justify-end"
                                    >
                                        <Button
                                            as={NextLink}
                                            href={"/modalidades/" + discipline.disciplineId + "/" + discipline.institutionISO}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            colorScheme="green"
                                        >
                                            Imprimir
                                        </Button>
                                    </Flex>
                                </Td>
                            </Tr>
                            )) : (
                            <Tr>
                                <Td
                                    colSpan={4}
                                >
                                    <Flex
                                        className="
                                            w-full
                                            py-10
                                            justify-center
                                            text-gray-600"
                                    >
                                        No hay listas de Buena Fe registradas
                                    </Flex>
                                </Td>
                            </Tr>
                        )
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    )
}