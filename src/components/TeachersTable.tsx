import { Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { GenerateParticipantCredentialPDFModal } from "./GenerateParticipantCredentialPDFModal";
import { type GENDERS } from "~/utils/constants";

type Participant = {
    institution: {
        ISO: number;
        abbreviation: string;
    };
    CI: string;
    firstname: string;
    lastname: string;
    gender: typeof GENDERS[number];
}

interface TeachersTableProps {
    participants?: Participant[];
    isLoading: boolean;
}

export function TeachersTable({ isLoading, participants }: TeachersTableProps) {
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
                                    py-12
                                    w-full
                                    justify-center
                                    gap-6
                                    text-gray-600"
                            >
                                <Text>Cargando lista de profesores</Text>
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
                                        <GenerateParticipantCredentialPDFModal
                                            CI={participant.CI}
                                            institution={participant.institution.abbreviation}
                                            name={participant.firstname + ' ' + participant.lastname}
                                            participantType="TEACHER"
                                            gender={participant.gender}
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        ))) : (
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
                                        No hay profesores registrados
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