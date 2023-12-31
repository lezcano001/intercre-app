import { Button, Flex, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { usePDF } from "@react-pdf/renderer";
import { type ReactElement } from "react";

interface MobileVersionProps {
    CI: string;
    document: ReactElement;
    as?: "Button" | "MenuItem"
}

export function MobileVersion({ 
    as = "Button",
    document,
    CI
 }: MobileVersionProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [instance] = usePDF({
        document
    })

    return (
        <>
            {as === "Button" ? (
                <Button
                    colorScheme="orange"
                    onClick={onOpen}
                >
                    Acreditación
                </Button>
            ) : <MenuItem onClick={onOpen}>Acreditación</MenuItem>}
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
                        Previsualización de Acreditación
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
                                <Text>Generando Acreditación</Text>
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
                                    La Acreditación fue generada correctamente
                                </Text>
                                <Button
                                    colorScheme="orange"
                                    download={"acreditacion_" + CI + ".pdf"}
                                    as='a'
                                    href={instance.url!}
                                    className='!bg-orange-400'
                                >
                                    Imprimir Acreditación
                                </Button>
                            </Flex>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}