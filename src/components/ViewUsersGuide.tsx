import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { isMobile, isBrowser } from 'react-device-detect'

export function ViewUsersGuide() {
    const { isOpen, onClose, onOpen } = useDisclosure()

    if (isMobile) {
        return (
            <Button
                colorScheme="orange"
                as="a"
                target="_blank"
                rel="noreferrer"
                download="Manual de Usuario"
                href="/manual-de-usuario.pdf"
            >
                Descargar Manual de Usuario
            </Button>
        )
    }

    if (isBrowser) {
        return (
            <>
                <Button
                    colorScheme="orange"
                    onClick={onOpen}
                    className="w-fit"
                >
                    Ver Manual de Usuario
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
                            Previsualización de Manual de Usuario
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex
                                as="iframe"
                                src="/manual-de-usuario.pdf"
                                className="
                                    w-full
                                    h-[60vh]"
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </>
        )
    }
}