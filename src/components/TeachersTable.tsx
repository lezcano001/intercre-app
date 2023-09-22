import { Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { GenerateParticipantCredentialPDFModal } from "./GenerateParticipantCredentialPDFModal";

export function TeachersTable() {
    const participants = api.participants.getAll.useQuery({
        participantType: 'TEACHER'
    })

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
                                <Text>Cargando lista de profesores</Text>
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