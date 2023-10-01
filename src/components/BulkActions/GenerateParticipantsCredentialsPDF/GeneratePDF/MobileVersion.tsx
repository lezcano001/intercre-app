import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { usePDF } from "@react-pdf/renderer";
import { useEffect, type ReactElement } from "react";

interface BrowserVersionProps {
    document: ReactElement;
    isDisabled?: boolean;
}

export function MobileVersion({
    document,
    isDisabled = false
}: BrowserVersionProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()

    
    const [instance, update] = usePDF({
        document
    })
    
    useEffect(() => {
        // eslint-disable-next-line
        update(document)
        // eslint-disable-next-line
    }, [document])
    
    return (
        <>
            <Button
                onClick={onOpen}
                colorScheme="orange"
                isDisabled={isDisabled}
            >
                Imprimir Acreditaciones
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="xl"
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
                    {instance.loading ? (
                            <Flex
                                className="
                                    items-center
                                    gap-4
                                    text-gray-600
                                    justify-center
                                    py-4"
                            >
                                <Spinner />
                                <Text>Generando Acreditaciones</Text>
                            </Flex>
                        ) : (
                            <Flex
                                className="
                                    flex-col
                                    items-center
                                    gap-4
                                    py-4"
                            >
                                <Text
                                    className="
                                        text-gray-600"
                                >
                                    Las Acreditaciones fueron generadas correctamente
                                </Text>
                                <Button
                                    colorScheme="orange"
                                    download={"acreditaciones_en_lote.pdf"}
                                    as='a'
                                    href={instance.url!}
                                    className='!bg-orange-400'
                                >
                                    Imprimir Acreditaciones
                                </Button>
                            </Flex>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    )
}