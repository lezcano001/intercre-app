import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure, ModalFooter, useToast } from "@chakra-ui/react"
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

interface DeleteParticipantModalProps {
    participantCI: string;
    onSuccessRedirectTo?: string;
}

export function DeleteParticipantModal({ participantCI, onSuccessRedirectTo }: DeleteParticipantModalProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const toast = useToast()

    const trpcUtils = api.useContext()
    const deleteParticipant = api.participants.deleteParticipant.useMutation({
        onSuccess: async () => {
            await trpcUtils.participants.invalidate()
        }
    })

    async function handleDeleteParticipant(participantCI: string) {
        // The try-catch is necessary to avoid the nextJS interface error
        setIsLoading(true)
        try {
            await deleteParticipant.mutateAsync({
                CI: participantCI
            })
            setIsLoading(false)

            toast({
                title: 'Participante eliminado con éxito',
                position: 'bottom-right',
                isClosable: true,
                status: 'success'
            })

            if (onSuccessRedirectTo) {
                await router.push(onSuccessRedirectTo)
            }
        } catch (err) {
            setIsLoading(false)
            if (err instanceof TRPCClientError) {
                toast({
                    title: 'Ha ocurrido un error al eliminar al participante',
                    description: err.message,
                    position: 'bottom-right',
                    isClosable: true,
                    status: 'error'
                })
            }
            // console.log(err)
        }
    }

    return (
        <>
            <Button
                colorScheme="red"
                onClick={onOpen}
                isLoading={isLoading}
            >
                Eliminar
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent
                    className="
                        p-4"
                >
                    <ModalHeader
                        className="
                            text-center
                            text-gray-700"
                    >
                        ¿Estás seguro que deseas borrar el registro del participante?
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text
                            className="
                                text-center
                                text-gray-600"
                        >
                            Los datos de registro del participante una vez eliminados no podrán ser recuperados
                        </Text>
                    </ModalBody>
                    <ModalFooter
                        className="
                            gap-4"
                    >
                        <Button
                            className="w-full"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="red"
                            className="
                                w-full"
                            onClick={() => {
                                void handleDeleteParticipant(participantCI)
                                onClose()
                            }}
                            isLoading={isLoading}
                            loadingText="Eliminando"
                        >
                            Eliminar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}