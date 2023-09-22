import { Flex, Heading } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import { TeachersTable } from "~/components/TeachersTable";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { api } from "~/utils/api";
import { TEACHERS_PER_PAGE } from "~/utils/constants";
import { SearchParticipantInput } from "~/components/SearchParticipantInput";
import { Pagination } from "~/components/Pagination";

export default function Teachers() {
    const [searchInput, setSearchInput] = useState("")

    const [currentPage, setCurrentPage] = useState(1)

    const debouncedSearchInput = useDebounce(searchInput, 400)

    const participants = api.participants.getAll.useQuery({
        filterByCI: debouncedSearchInput ?? undefined,
        page: currentPage,
        perPage: TEACHERS_PER_PAGE,
        participantType: 'TEACHER'
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
                        mb-12"
                >
                    <Heading
                        as="h1"
                        className="
                            !text-2xl
                            text-gray-600"
                    >
                        Listado de Profesores
                    </Heading>
                    <SearchParticipantInput
                        searchText={searchInput}
                        onChange={(e) => {setSearchInput(e.target.value)}}
                    />
                </Flex>
                <TeachersTable
                    isLoading={participants.isFetching}
                    participants={participants.data?.data.participants}
                />
                <Pagination
                    onPageChange={setCurrentPage}
                    totalCountOfRegisters={participants.data?.pagination.total ?? TEACHERS_PER_PAGE}
                    currentPage={currentPage}
                    registersPerPage={TEACHERS_PER_PAGE}
                />
            </Card>
        </DashboardLayout>
    )
}