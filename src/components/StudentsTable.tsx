import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Flex, Button, Spinner, Text } from "@chakra-ui/react";
import { api } from '~/utils/api'

import NextLink from 'next/link'
import { DeleteParticipantModal } from "./DeleteParticipantModal";


// Add the sorting to the table headers
export function StudentsTable() {
    const participants = api.participants.getAll.useQuery()

    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th
                            className="
                                w-[20%]"
                        >
                            DOC DE IDENTIDAD
                        </Th>
                        <Th>NOMBRE Y APELLIDO</Th>
                        <Th isNumeric>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {participants.isFetching ? (
                        <Tr>
                            <Td
                                colSpan={3}
                            >
                                <Flex
                                    className="
                                        py-12
                                        w-full
                                        justify-center
                                        gap-6
                                        text-gray-600"
                                >
                                    <Text>Cargando lista de alumnos</Text>
                                    <Spinner />
                                </Flex>
                            </Td>
                        </Tr>
                    ) : (
                        participants?.data && participants.data.length > 0 ? (participants.data.map(participant => (
                            <Tr
                                key={participant.CI}
                            >
                                <Td>{participant.CI}</Td>
                                <Td>{participant.firstname + ' ' + participant.lastname}</Td>
                                <Td isNumeric>
                                    <Flex
                                        className="
                                            gap-2.5
                                            justify-end"
                                    >
                                        <Button
                                            as={NextLink}
                                            href={`/alumnos/${participant.CI}`}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            as={NextLink}
                                            href={"/alumnos/editar/" + participant.CI}
                                        >
                                            Editar
                                        </Button>
                                        <DeleteParticipantModal
                                            participantCI={String(participant.CI)}
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={3}
                            >
                                <Flex
                                    className="
                                        w-full
                                        py-10
                                        justify-center
                                        text-gray-600"
                                >
                                    No hay alumnos registrados
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}