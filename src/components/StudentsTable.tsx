import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Flex, Button, Spinner, Text, useMediaQuery } from "@chakra-ui/react";

import NextLink from 'next/link'
import { DeleteParticipantModal } from "./DeleteParticipantModal";
import { GenerateParticipantCredentialPDF } from "./GenerateParticipantCredentialPDF";
import { StudentActionsCondensedButton } from "./StudentActionsCondensedButton";

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
    const [isLargerThan640] = useMediaQuery('(min-width: 640px)')

    return (
        <TableContainer
            className=" 
                text-sm
                sm:text-base
                max-h-[35vh]"
            overflowY="auto"
        >
            <Table variant='simple'>
                <Thead
                    className="
                        sticky
                        bg-white
                        top-0
                        shadow-sm
                        z-10"
                >
                    <Tr>
                        <Th
                            className="
                                w-[20%]"
                        >
                            {isLargerThan640 ? "DOC. DE IDENTIDAD" : "DOC. Nº"}
                        </Th>
                        <Th>{isLargerThan640 ? "NOMBRE Y APELLIDO" : "NOMBRE"}</Th>
                        <Th isNumeric>{isLargerThan640 ? "ACCIONES" : ""}</Th>
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
                                    {isLargerThan640 ? (
                                        <Flex
                                            className="
                                                gap-2.5
                                                justify-end"
                                        >
                                            <Button
                                                as={NextLink}
                                                href={"/alumnos/" + participant.CI}
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                as={NextLink}
                                                href={"/alumnos/editar/" + participant.CI}
                                            >
                                                Editar
                                            </Button>
                                            <GenerateParticipantCredentialPDF
                                                CI={participant.CI}
                                                institution={participant.institution.abbreviation}
                                                name={participant.firstname + ' ' + participant.lastname}
                                                participantType="STUDENT"
                                                age={participant.participantAge}
                                            />
                                            <DeleteParticipantModal
                                                participantCI={participant.CI}
                                            />
                                        </Flex>
                                    ) : <StudentActionsCondensedButton
                                        institutionAbbreviation={participant.institution.abbreviation}
                                        participantAge={participant.participantAge}
                                        participantCI={participant.CI}
                                        participantName={participant.firstname + ' ' + participant.lastname}
                                    />}
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