import { Button, Flex, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { PDFViewer } from "@react-pdf/renderer";
import { useState, type ReactElement, useEffect } from "react";

interface BrowserVersionProps {
    as?: "Button" | "MenuItem"
    document: ReactElement;
}

export function BrowserVersion({ document, as = "Button" }: BrowserVersionProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [isClientSide, setIsClientSide] = useState(false)

    useEffect(() => {
        setIsClientSide(true)
    }, [])

    return (
        <>
            {as === "Button" ? (
                <Button
                    colorScheme="orange"
                    onClick={onOpen}
                >
                    Ver Acreditación
                </Button>
            ) : <MenuItem onClick={onOpen}>Ver Acreditación</MenuItem>}
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
                                {document}
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