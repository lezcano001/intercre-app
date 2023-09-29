import { Flex, Heading } from "@chakra-ui/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Pagination } from "~/components/Pagination";
import { SearchInputComponent } from "~/components/SearchInputComponent";
import { SquadsTable } from "~/components/SquadsTable";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import { api } from "~/utils/api";
import { DISCIPLINES_PER_PAGE, STUDENTS_PER_PAGE } from "~/utils/constants";

export default function Inscriptions() {
    const [searchInput, setSearchInput] = useState("")

    const [currentPage, setCurrentPage] = useState(1)

    const debouncedSearchInput = useDebounce(searchInput, 400)

    const disciplines = api.disciplines.getAll.useQuery({
        filterByName: debouncedSearchInput ?? undefined,
        page: currentPage,
        perPage: DISCIPLINES_PER_PAGE,
    }, {
        staleTime: 5 * 1000 // 5 seconds
    })

    useEffect(() => {
        if (disciplines.data?.pagination.page) {
            setCurrentPage(disciplines.data.pagination.page)
        }
    }, [disciplines.data?.pagination.page])

    return (
        <DashboardLayout>
            <Flex
                className="
                    flex-col
                    gap-9"
            >
                <Card
                    className="
                        flex-col"
                >
                    <Heading
                        className="
                            !text-xl
                            sm:!text-2xl
                            text-gray-600
                            mb-12"
                    >
                        Listas de Buena Fe
                    </Heading>
                    <SearchInputComponent
                        containerClassname="mb-8 min-[800px]:!w-[20rem]"
                        searchText={searchInput}
                        onChange={(e) => {setSearchInput(e.target.value)}}
                        label="Buscar Modalidad:"
                        placeholder="Ingrese el Nombre de la Modalidad"
                    />
                    <SquadsTable
                        disciplines={disciplines.data?.data.disciplines ?? []}
                        isLoading={disciplines.isFetching}
                    />
                    <Pagination
                        onPageChange={setCurrentPage}
                        currentPage={currentPage}
                        totalCountOfRegisters={disciplines.data?.pagination.total ?? STUDENTS_PER_PAGE}
                        registersPerPage={DISCIPLINES_PER_PAGE}
                    />
                </Card>
            </Flex>
        </DashboardLayout>
    )
}