import { Button, Flex, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react"
import { PDFViewer } from "@react-pdf/renderer";
import { type ReactElement, useEffect, useState } from "react"

interface BrowserVersionProps {
    document: ReactElement;
    as?: "Button" | "MenuItem";
    isLoading?: boolean;
}

export function BrowserVersion({
    document,
    as = "Button",
    isLoading = false
}: BrowserVersionProps) {
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
                    Imprimir Lista de Buena Fe
                </Button>
            ) : <MenuItem onClick={onOpen}>Imprimir Lista de Buena Fe</MenuItem>}
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
                        Previsualización de Lista de Buena Fe 
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {!isClientSide
                            ?   null
                            :   isLoading
                                    ?   <Spinner
                                            className="
                                                mx-auto"
                                        />
                                    :   (
                                        <PDFViewer
                                            className="
                                                w-full
                                                h-[60vh]"
                                        >
                                            {document}
                                        </PDFViewer>
                                    )
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