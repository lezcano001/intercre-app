import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { BulkParticipantsCredentialsPDF } from '../../../templates/BulkParticipantsCredentialsPDF'
import { type GENDERS, type PARTICIPANTS_TYPES_MAP } from "~/utils/constants";

type Participant = {
    CI: string;
    name: string;
    age?: number;
    institution: string;
    gender?: typeof GENDERS[number];
    participantType: keyof typeof PARTICIPANTS_TYPES_MAP;
}

interface GeneratePDFProps {
    participants: Participant[];
}

export function GeneratePDF({ participants }: GeneratePDFProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [isClientSide, setIsClientSide] = useState(false)

    useEffect(() => {
        setIsClientSide(true)
    }, [])

    return (
        <>
            <Button
                colorScheme="green"
                onClick={onOpen}
            >
                Generar Acreditaciones
            </Button>
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
                        Previsualización de Acreditaciones en Lote
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isClientSide ? (
                            <PDFViewer
                                className="
                                    w-full
                                    h-[60vh]"
                            >
                                <BulkParticipantsCredentialsPDF
                                    participants={participants}
                                />
                            </PDFViewer>                       
                        ) : null}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}