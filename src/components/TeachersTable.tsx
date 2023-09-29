import { Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useMediaQuery } from "@chakra-ui/react";
import { GenerateParticipantCredentialPDF } from "./GenerateParticipantCredentialPDF";
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
                                    {isLargerThan640 ? (
                                        <Flex
                                            className="
                                                gap-2.5
                                                justify-end"
                                        >
                                            <GenerateParticipantCredentialPDF
                                                CI={participant.CI}
                                                institution={participant.institution.abbreviation}
                                                name={participant.firstname + ' ' + participant.lastname}
                                                participantType="TEACHER"
                                                gender={participant.gender}
                                            />
                                        </Flex>
                                    ) : null} {/* As action view the element instead print PDF for now */}
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