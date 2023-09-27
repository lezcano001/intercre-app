import { Flex, Heading } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import { TeachersTable } from "~/components/TeachersTable";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { api } from "~/utils/api";
import { TEACHERS_PER_PAGE } from "~/utils/constants";
import { SearchParticipantInput } from "~/components/SearchParticipantInput";
import { Pagination } from "~/components/Pagination";
import { GenerateParticipantsCredentialsPDF } from "~/components/BulkActions/GenerateParticipantsCredentialsPDF";

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

    useEffect(() => {
        if (participants.data?.pagination.page) {
            setCurrentPage(participants.data.pagination.page)
        }
    }, [participants.data?.pagination.page])

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
                        flex-wrap
                        gap-6
                        w-full
                        mb-12"
                >
                    <Heading
                        as="h1"
                        className="
                            !text-xl
                            sm:!text-2xl
                            text-gray-600"
                    >
                        Listado de Profesores
                    </Heading>
                    <GenerateParticipantsCredentialsPDF
                        participantType="TEACHER"
                    />
                </Flex>
                <SearchParticipantInput
                    containerClassname="mb-8 min-[800px]:!w-[20rem]"
                    searchText={searchInput}
                    onChange={(e) => {setSearchInput(e.target.value)}}
                />
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