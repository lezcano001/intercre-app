import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Flex, Button, Spinner, Text } from "@chakra-ui/react";

import NextLink from 'next/link'
import { DeleteParticipantModal } from "./DeleteParticipantModal";
import { GenerateParticipantCredentialPDFModal } from "./GenerateParticipantCredentialPDFModal";

type Participant = {
    participantAge: number;
    institution: {
        ISO: number;
        abbreviation: string;
    };
    CI: string;
    firstname: string;
    lastname: string;
}

interface StudentsTableProps {
    participants?: Participant[];
    isLoading: boolean;
}
// Add the sorting to the table headers
export function StudentsTable({ participants, isLoading }: StudentsTableProps) {
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
                    {isLoading ? (
                        <Tr>
                            <Td
                                colSpan={3}
                            >
                                <Flex
                                    className="
                                        py-20
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
                        participants && participants.length > 0 ? (participants.map(participant => (
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
                                        <GenerateParticipantCredentialPDFModal
                                            CI={participant.CI}
                                            institution={participant.institution.abbreviation}
                                            name={participant.firstname + ' ' + participant.lastname}
                                            participantType="STUDENT"
                                            age={participant.participantAge}
                                        />
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