import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { PDFViewer } from "@react-pdf/renderer";
import { type ReactElement, useEffect, useState } from "react"

interface BrowserVersionProps {
    document: ReactElement;
    isDisabled?: boolean;
}

export function BrowserVersion({
    document,
    isDisabled = false
}: BrowserVersionProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [isClientSide, setIsClientSide] = useState(false)

    useEffect(() => {
        setIsClientSide(true)
    }, [])
    
    return (
        <>
            <Button
                colorScheme="orange"
                onClick={onOpen}
                isDisabled={isDisabled}
            >
                Imprimir Acreditaciones
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
                        {isClientSide
                            ?   <PDFViewer
                                    className="
                                        w-full
                                        h-[60vh]"
                                >
                                    {document}
                                </PDFViewer>
                            :   null
                        }
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