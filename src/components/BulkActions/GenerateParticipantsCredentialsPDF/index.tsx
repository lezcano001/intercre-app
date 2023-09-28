import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SearchParticipantInput } from "~/components/SearchParticipantInput";
import { ParticipantsTable } from "../ParticipantsTable";
import { useDebounce } from "@uidotdev/usehooks";
import { api } from "~/utils/api";
import { Pagination } from "~/components/Pagination";
import { GeneratePDF } from "./GeneratePDF";
import { type PARTICIPANTS_TYPES_MAP, STUDENTS_PER_PAGE } from "~/utils/constants";

interface GenerateParticipantsCredentialsPDFProps {
    participantType?: keyof typeof PARTICIPANTS_TYPES_MAP;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export function GenerateParticipantsCredentialsPDF({
    participantType = "STUDENT",
    isOpen,
    onClose,
    onOpen
}: GenerateParticipantsCredentialsPDFProps) {
    const [searchInput, setSearchInput] = useState("")
    
    const [currentPage, setCurrentPage] = useState(1)
    
    const debouncedSearchInput = useDebounce(searchInput, 400)
    
    const participants = api.participants.getAll.useQuery({
        filterByCI: debouncedSearchInput ?? undefined,
        page: currentPage,
        perPage: STUDENTS_PER_PAGE,
        participantType: participantType
    }, {
        enabled: false,
        staleTime: Infinity
    })

    function handleOnClose() {
        setSearchInput("")
        onClose()
    }
    
    async function handleOpenModal() {
        onOpen()
        await participants.refetch()
    }

    const [checkedParticipants, setCheckedParticipants] = useState(participants.data?.data.participants.map(p => false) ?? [])

    useEffect(() => {
        if (participants.data?.pagination.page) {
            setCurrentPage(participants.data.pagination.page)
        }
    }, [participants.data?.pagination.page])

    useEffect(() => {
        void participants.refetch()

    // eslint-disable-next-line
    }, [debouncedSearchInput, currentPage])

    useEffect(() => {
        if (participants.data?.data.participants) {
            setCheckedParticipants(participants.data?.data.participants.map(p => false))
        }
    }, [participants.data?.data.participants])

    return (
        <>
            <Button
                onClick={() => {
                    void handleOpenModal()
                }}
                colorScheme="green"
                className="
                    w-full
                    sm:w-fit"
            >
                Multiples Acreditaciones
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={handleOnClose}
                size="3xl"
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
                        Acreditaciones en Lote
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text
                            className="
                                text-gray-500
                                mb-8"
                        >
                            Seleccione los participantes para los cuales desea generar acreditaciones
                        </Text>
                        <Flex
                            className="
                                flex-wrap
                                justify-between
                                items-end
                                gap-6
                                mb-8"
                        >
                            <SearchParticipantInput
                                containerClassname="min-[800px]:!w-[20rem]"
                                searchText={searchInput}
                                onChange={(e) => {setSearchInput(e.target.value)}}
                            />
                            <GeneratePDF
                                isDisabled={!(checkedParticipants.find(p => p) ?? false)}
                                participants={participants.data?.data?.participants.filter((_, idx) => {
                                    return checkedParticipants[idx]
                                }).map(participant => {
                                    return {
                                        ...participant,
                                        institution: participant.institution.abbreviation,
                                        age: participant.participantAge,
                                        name: participant.firstname + ' ' + participant.lastname,
                                    }
                                }) ?? []}
                            />
                        </Flex>
                        <ParticipantsTable
                            isLoading={participants.isFetching && !participants.isRefetching}
                            participants={participants.data?.data.participants ?? []}
                            checkedParticipants={checkedParticipants}
                            setCheckedParticipants={setCheckedParticipants}
                        />
                        <Pagination
                            onPageChange={setCurrentPage}
                            currentPage={currentPage}
                            totalCountOfRegisters={participants.data?.pagination.total ?? STUDENTS_PER_PAGE}
                            registersPerPage={STUDENTS_PER_PAGE}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}