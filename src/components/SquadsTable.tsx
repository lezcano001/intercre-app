import { Button, Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { TRPCError } from "@trpc/server";

import NextLink from 'next/link'
import { api } from "~/utils/api";

export function SquadsTable() {
    const participations = api.participations.getAll.useQuery()

    if (participations?.data instanceof TRPCError) {
        return (
            <Flex>
                {participations.data.message}
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
                        <Th>INSC. POR</Th>
                        <Th
                            isNumeric
                        >
                            ACCIONES
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {participations.isFetching ? (
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
                        participations?.data && participations.data.length > 0 ? participations.data.map(participation => (
                            <Tr
                                key={participation.disciplineId + ' ' + participation.institutionISO}
                            >
                                <Td>
                                    {participation.discipline}
                                </Td>
                                <Td>
                                    {participation.genreCategory}
                                </Td>
                                <Td>
                                    {participation.registeredBy}
                                </Td>
                                <Td
                                    isNumeric
                                >
                                    <Button
                                        as={NextLink}
                                        href={"/inscripciones/" + participation.disciplineId + "/" + participation.institutionISO}
                                        colorScheme="green"
                                    >
                                        Imprimir
                                    </Button>
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