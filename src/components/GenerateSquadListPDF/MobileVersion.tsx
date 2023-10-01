import { Button, Flex, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { usePDF } from "@react-pdf/renderer";
import { useEffect, type ReactElement } from "react";

interface MobileVersionProps {
    discipline: string;
    document: ReactElement;
    as?: "Button" | "MenuItem";
    isLoading: boolean;
    category: string;
}

export function MobileVersion({
    discipline,
    document,
    as = "Button",
    isLoading,
    category
}: MobileVersionProps) {
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
            {as === "Button" ? (
                <Button
                    colorScheme="orange"
                    onClick={onOpen}
                >
                    Imprimir
                </Button>
            ) : <MenuItem onClick={onOpen}>Imprimir</MenuItem>}
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
                        Generar de Lista de Buena Fe 
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isLoading || instance.loading ? (
                            <Flex
                                className="
                                    items-center
                                    gap-4
                                    text-gray-600
                                    justify-center
                                    py-4"
                            >
                                <Spinner />
                                <Text>Generando Lista de Buena Fe...</Text>
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
                                    La lista de Buena Fe fue generada correctamente
                                </Text>
                                <Button
                                    colorScheme="orange"
                                    download={"Lista_de_buena_fe-" + discipline + "-" + category + "-" + ".pdf"}
                                    as='a'
                                    href={instance.url!}
                                    className='!bg-orange-400'
                                >
                                    Imprimir Lista de Buena Fe
                                </Button>
                            </Flex>
                        )}
                    </ModalBody>
                </ModalContent>

            </Modal>
        </>        
    )
}