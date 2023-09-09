import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Flex, Button } from "@chakra-ui/react";
import { api } from '~/utils/api'

import NextLink from 'next/link'
import { DeleteParticipantModal } from "./DeleteParticipantModal";


// Add the sorting to the table headers
export function ParticipantsTable() {
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
                            DOCUMENTO DE IDENTIDAD
                        </Th>
                        <Th>NOMBRE</Th>
                        <Th isNumeric>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {participants?.data?.map(participant => (
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
                                        href={`/participantes/${participant.CI}`}
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        as={NextLink}
                                        href={"/participantes/editar/" + participant.CI}
                                    >
                                        Editar
                                    </Button>
                                    <DeleteParticipantModal
                                        participantCI={String(participant.CI)}
                                    />
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}