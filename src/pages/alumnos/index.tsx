import { Button, Flex, Heading } from "@chakra-ui/react";
import { StudentsTable } from "~/components/StudentsTable";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link'
import { SearchParticipantInput } from "~/components/SearchParticipantInput";
import { useState } from "react";
import { Pagination } from "~/components/Pagination";
import { STUDENTS_PER_PAGE } from "~/utils/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { api } from "~/utils/api";

export default function Participants() {
    const [searchInput, setSearchInput] = useState("")

    const [currentPage, setCurrentPage] = useState(1)

    const debouncedSearchInput = useDebounce(searchInput, 400)

    const participants = api.participants.getAll.useQuery({
        filterByCI: debouncedSearchInput ?? undefined,
        page: currentPage,
        perPage: STUDENTS_PER_PAGE
    })

    return (
        <DashboardLayout>
            <Card
                className="flex-col"
            >
                <Flex
                    className="
                        flex
                        items-center
                        justify-between
                        w-full
                        mb-12
                        gap-20"
                >
                    <Heading
                        as="h1"
                        className="
                            !text-2xl
                            text-gray-600
                            whitespace-nowrap"
                    >
                        Listado de Alumnos
                    </Heading>
                    <Flex
                        className="
                            gap-5
                            w-full
                            justify-end"
                    >
                        <SearchParticipantInput
                            searchText={searchInput}
                            onChange={(e) => {setSearchInput(e.target.value)}}
                        />
                        <Button
                            as={NextLink}
                            href="/alumnos/crear"
                            colorScheme="green"
                        >
                            Agregar Alumno
                        </Button>
                    </Flex>
                </Flex>
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
            </Card>
        </DashboardLayout>
    )
}