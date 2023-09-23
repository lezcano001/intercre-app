import { Button, Flex, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { PDFViewer } from "@react-pdf/renderer"
import { useEffect, useState } from "react"
import { ParticipantCredentialPDF } from "./templates/ParticipantCredentialPDF";

const PARTICIPANTS_TYPES_MAP = {
    "STUDENT": 'ESTUDIANTE',
    "TEACHER": 'PROFESOR'
}

interface GenerateParticipantCredentialPDFModal {
    CI: string;
    name: string;
    age?: number;
    institution: string;
    participantType: keyof typeof PARTICIPANTS_TYPES_MAP;
    gender?: "MALE" | "FEMALE";
    as?: "Button" | "MenuItem"
}

export function GenerateParticipantCredentialPDFModal({
    CI,
    institution,
    name,
    age,
    participantType,
    gender,
    as = "Button"
}: GenerateParticipantCredentialPDFModal) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [renderPDF, setRenderPDF] = useState(false)

    useEffect(() => {
        setRenderPDF(true)
    }, [])


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
                size="2xl"
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
                        {renderPDF ? (
                            <PDFViewer
                                className="
                                    w-full
                                    h-[60vh]"
                            >
                                <ParticipantCredentialPDF
                                    CI={CI}
                                    institution={institution}
                                    name={name}
                                    age={age}
                                    participantType={participantType}
                                    gender={gender}
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