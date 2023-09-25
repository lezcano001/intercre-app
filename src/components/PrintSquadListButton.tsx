import { Button, MenuItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, useDisclosure, Text, Spinner } from "@chakra-ui/react"
import { PDFViewer } from "@react-pdf/renderer"
import { useEffect, useState } from "react";
import { SquadListInscriptionPDF } from "./templates/SquadListInscriptionPDF";
import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { ROLES_MAP } from "~/utils/constants";

interface PrintSquadListButton {
    disciplineId: string;
    category: string;
    institutionISO: number;
    as?: "Button" | "MenuItem";
}

export function PrintSquadListButton({
    disciplineId,
    institutionISO,
    as = "Button"
}: PrintSquadListButton) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [isClientSide, setIsClientSide] = useState(false)

    const squad = api.squads.getSquad.useQuery({
        disciplineId,
        institutionISO
    })

    useEffect(() => {
        setIsClientSide(true)
    }, [])

    if (squad.isFetching) {
        return <Spinner />
    }

    if (squad.data instanceof TRPCError) {
        // Poner aquí un toast
        return <Text>Error en el servidor</Text>
    }

    return (
        <>
            {as === "Button" ? (
                <Button
                    colorScheme="orange"
                    onClick={onOpen}
                >
                    Imprimir Acreditación
                </Button>
            ) : <MenuItem onClick={onOpen}>Imprimir Acreditación</MenuItem>}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="6xl"
            >
                <ModalOverlay />
                <ModalContent
                    className="
                        p-2"
                >
                    <ModalHeader
                        className="
                            text-gray-600"
                    >
                        Previsualización de Acreditación 
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isClientSide ? (
                            <PDFViewer
                                className="
                                    w-full
                                    h-[60vh]"
                            >
                                <SquadListInscriptionPDF
                                    institution={"Centro Regional de Educación " + squad.data!.institution?.name}
                                    department={squad.data!.institution!.department}
                                    city={squad.data!.institution!.city}
                                    roles={squad.data!.roles.map(role => {
                                        return {
                                            students: role.allowedParticipantType === "STUDENT",
                                            participants: role.participants.map(participant => {
                                                return {
                                                    CI: participant.CI,
                                                    firstname: participant.firstname,
                                                    lastname: participant.lastname,
                                                    birthDate: `${participant.birthDate.getDate()}/${participant.birthDate.getMonth()}/${participant.birthDate.getFullYear()}`,
                                                    telephone: participant.telephone ?? ""
                                                }
                                            }),
                                            roleName: ROLES_MAP[role.role as keyof typeof ROLES_MAP]
                                        }
                                    })}
                                    discipline={squad.data!.discipline.name}
                                    category={squad.data!.discipline.genreCategory}
                                />
                            </PDFViewer>
                        ) : null}
                        <Flex
                            className="
                                w-full
                                justify-end
                                mt-8"
                        >
                            <Button
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}