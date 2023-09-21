import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { StandardInput } from "../ui/StandardInput";
import { useRef, useState } from "react";
import { ResultsList } from "./ResultsList";
import { type GENDERS_CATEGORIES } from "~/utils/constants";

interface SuscribeParticipantToSquadButtonProps {
    institutionISO: number;
    roleId: string;
    disciplineId: string;
    aceptedGenderCategory?: typeof GENDERS_CATEGORIES[number];
    restrictGenders: boolean;
    allowedParticipantType: "STUDENT" | "TEACHER";
}

export function SuscribeParticipantToSquadButton({
    disciplineId,
    institutionISO,
    roleId,
    aceptedGenderCategory,
    restrictGenders,
    allowedParticipantType
}: SuscribeParticipantToSquadButtonProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [searchInput, setSearchInput] = useState("")

    const inputRef = useRef<HTMLInputElement | null>(null)
    
    return (
        <>
            <Button
                colorScheme="green"
                onClick={onOpen}
            >
                Agregar participante
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                initialFocusRef={inputRef}
                onCloseComplete={() => {
                    setSearchInput("")
                }}
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
                        Agregar Participante
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        <Flex
                            className="
                                flex-col
                                gap-6"
                        >
                            <Flex
                                as="form"
                            >
                                <StandardInput
                                    label="Doc. Identidad:"
                                    placeholder="Ingrese el Doc. de Identidad"
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                    ref={inputRef}
                                />
                            </Flex>
                            <ResultsList
                                allowedParticipantsType={allowedParticipantType}
                                searchInput={searchInput.toLowerCase()}
                                disciplineId={disciplineId}
                                institutionISO={institutionISO}
                                aceptedGenderCategory={aceptedGenderCategory}
                                roleId={roleId}
                                restrictGenders={restrictGenders}
                                onAddUser={onClose}
                            />
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}