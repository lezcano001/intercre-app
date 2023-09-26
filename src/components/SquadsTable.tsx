import { Button, Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useMediaQuery } from "@chakra-ui/react";
import { TRPCError } from "@trpc/server";

import NextLink from 'next/link'
import { api } from "~/utils/api";
import { SquadListActionsCondensedButton } from "./SquadListActionsCondensedButton";
import { GenerateSquadListPDF } from "./GenerateSquadListPDF";

export function SquadsTable() {
    const disciplines = api.disciplines.getAll.useQuery();

    const [isLargerThan640] = useMediaQuery('(min-width: 640px)')

    if (disciplines?.data instanceof TRPCError) {
        return (
            <Flex>
                {disciplines.data.message}
            </Flex>
        )
    }

    return (
        <TableContainer
            className=" 
                text-sm
                sm:text-base"
        >
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>DEPORTE</Th>
                        <Th>CATEGORÍA</Th>
                        <Th
                            isNumeric
                        >
                            {isLargerThan640 ? "ACCIONES" : ""}
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
                                    {isLargerThan640 ? (
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
                                            <GenerateSquadListPDF
                                                disciplineId={discipline.disciplineId}
                                                institutionISO={discipline.institutionISO}
                                                institutionName={discipline.name}
                                                category={discipline.genreCategory}
                                            />
                                        </Flex>
                                    ) : (
                                        <SquadListActionsCondensedButton
                                            disciplineId={discipline.disciplineId}
                                            institutionName={discipline.name}
                                            institutionISO={discipline.institutionISO}
                                            category={discipline.genreCategory}
                                        />
                                    )}
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