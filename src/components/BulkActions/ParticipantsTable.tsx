import { Checkbox, Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useMediaQuery } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

type Participant = {
    CI: string;
    firstname: string;
    lastname: string;
}

interface ParticipantsTableProps {
    participants: Participant[];
    isLoading: boolean;
    className?: HTMLDivElement["className"];
    checkedParticipants: boolean[];
    setCheckedParticipants: (checkedParticipants: boolean[]) => void;
}

export function ParticipantsTable({ isLoading, participants, className = "", checkedParticipants, setCheckedParticipants }: ParticipantsTableProps) {
    const [isLargerThan640] = useMediaQuery('(min-width: 640px)')

    const allChecked = checkedParticipants.length > 0 && checkedParticipants.every(checkedParticipant => checkedParticipant)

    return (
        <TableContainer
            className={twMerge(`
                text-sm
                sm:text-base
                border-[1px]
                border-slate-200
                p-2
                rounded-md`, className)}
        >
            <Table
                variant='striped'
            >
                <Thead>
                    <Tr>
                        <Th
                            className="
                                w-[10%]"
                        >
                            <Checkbox
                                borderColor="gray.400"
                                disabled={participants.length === 0}
                                isChecked={allChecked}
                                onChange={e => setCheckedParticipants(checkedParticipants.map(_ => e.target.checked))}
                            />
                        </Th>
                        <Th
                            className="
                                w-[30%]"
                        >
                            {isLargerThan640 ? "DOC. DE IDENTIDAD" : "DOC. Nº"}
                        </Th>
                        <Th>{isLargerThan640 ? "NOMBRE Y APELLIDO" : "NOMBRE"}</Th>
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
                        participants && participants.length > 0 ? (participants.map((participant, idx) => {
                            return (
                                <Tr
                                    key={participant.CI}
                                >
                                    <Td>
                                        <Checkbox
                                            borderColor="gray.400"
                                            isChecked={checkedParticipants[idx]}
                                            onChange={e => setCheckedParticipants(checkedParticipants.map(((checkedParticipant, idx2) => {
                                                if (idx === idx2) return e.target.checked

                                                return checkedParticipant
                                            })))}
                                        />
                                    </Td>
                                    <Td>{participant.CI}</Td>
                                    <Td>{participant.firstname + ' ' + participant.lastname}</Td>
                                </Tr>
                            )
                        })
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