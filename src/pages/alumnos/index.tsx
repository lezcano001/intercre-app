import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { StudentsTable } from "~/components/StudentsTable";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link'
import { SearchInputComponent } from "~/components/SearchInputComponent";
import { useEffect, useState } from "react";
import { Pagination } from "~/components/Pagination";
import { STUDENTS_PER_PAGE } from "~/utils/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { api } from "~/utils/api";
import { GenerateParticipantsCredentialsPDF } from "~/components/BulkActions/GenerateParticipantsCredentialsPDF";

export default function Participants() {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [searchInput, setSearchInput] = useState("")

    const [currentPage, setCurrentPage] = useState(1)

    const debouncedSearchInput = useDebounce(searchInput, 400)

    const participants = api.participants.getAll.useQuery({
        filterByCI: debouncedSearchInput ?? undefined,
        page: currentPage,
        perPage: STUDENTS_PER_PAGE
    }, {
        staleTime: isOpen ? Infinity : 5 * 1000, // 5 seconds
    })

    useEffect(() => {
        if (participants.data?.pagination.page) {
            setCurrentPage(participants.data.pagination.page)
        }
    }, [participants.data?.pagination.page])

    return (
        <DashboardLayout>
            <Card
                className="
                    flex-col"
            >
                <Flex
                    className="
                        flex
                        items-center
                        justify-between
                        w-full
                        mb-12
                        flex-wrap
                        gap-6"
                >
                    <Heading
                        as="h1"
                        className="
                            !text-xl
                            sm:!text-2xl
                            text-gray-600"
                    >
                        Listado de Alumnos
                    </Heading>
                    <Flex
                        className="
                            gap-3
                            flex-wrap"
                    >
                        <Button
                            as={NextLink}
                            href="/alumnos/crear"
                            colorScheme="green"
                            className="
                                px-4
                                flex
                                flex-shrink-0"
                        >
                            Agregar Alumno
                        </Button>
                    </Flex>
                </Flex>
                <SearchInputComponent
                    containerClassname="mb-8 min-[800px]:!w-[20rem]"
                    searchText={searchInput}
                    onChange={(e) => {setSearchInput(e.target.value)}}
                    label="Buscar Alumno:"
                    placeholder="Ingrese un Doc. de Identidad"
                />
                <StudentsTable
                    participants={participants.data?.data.participants}
                    isLoading={participants.isFetching}
                />
                <Pagination
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    totalCountOfRegisters={participants.data?.pagination.total ?? STUDENTS_PER_PAGE}
                    registersPerPage={STUDENTS_PER_PAGE}
                />

                <Flex
                    className="
                        justify-end
                        mt-12
                        w-full"
                >
                    <GenerateParticipantsCredentialsPDF
                        isOpen={isOpen}
                        onClose={onClose}
                        onOpen={onOpen}
                    />
                </Flex>
            </Card>
        </DashboardLayout>
    )
}