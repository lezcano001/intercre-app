import { Box, Stack, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";
import { useEffect } from "react";

interface PatinationProps {
    totalCountOfRegisters: number;
    registersPerPage?: number;
    currentPage?: number;
    onPageChange: (page: number) => void;
}

const siblingsCount = 1

export function Pagination({
    onPageChange,
    totalCountOfRegisters,
    currentPage = 1,
    registersPerPage = 10
}: PatinationProps) {
    useEffect(() => {
        if (totalCountOfRegisters < (currentPage - 1) * registersPerPage) {
            onPageChange(1)
        }

    }, [totalCountOfRegisters, onPageChange, currentPage, registersPerPage])

    const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage)

    const firstRegister = totalCountOfRegisters > 0 ? (currentPage - 1) * registersPerPage + 1 : 0
    const lastRegister = totalCountOfRegisters - registersPerPage < firstRegister ? totalCountOfRegisters : firstRegister + registersPerPage - 1

    const previousPages = []
    let previousPage = currentPage - 1
    while (previousPage >= 1 && previousPage >= currentPage - siblingsCount) {
        previousPages.unshift(previousPage)
        previousPage -= 1
    }

    const nextPages = []
    let nextPage = currentPage + 1
    while (nextPage <= lastPage && nextPage <= currentPage + siblingsCount) {
        nextPages.push(nextPage)
        nextPage += 1
    }

    return (
        <Stack
            spacing="6"
            direction="row"
            className="
                mt-6
                justify-between
                items-center"
        >
            <Box>
                <strong>{firstRegister}</strong> - <strong>{lastRegister}</strong> de <strong>{totalCountOfRegisters}</strong>
            </Box>
            <Stack
                direction="row"
                spacing="2"
            >
                {currentPage > (1 + siblingsCount) && (
                    <>
                        <PaginationItem onPageChange={onPageChange} number={1} />
                        {currentPage > (siblingsCount + 2) && (
                            <Text className="text-gray-300 text-center w-8">...</Text>
                        )}
                    </>
                )}

                {previousPages.length > 0 ? previousPages.map(page => (
                    <PaginationItem onPageChange={onPageChange} key={page} number={page} />
                )) : null}

                <PaginationItem onPageChange={onPageChange} number={currentPage} isActive />

                {nextPages.length > 0 && nextPages.map(page => (
                    <PaginationItem onPageChange={onPageChange} key={page} number={page} />
                ))}

                {(currentPage + siblingsCount) < lastPage && (
                    <>
                        {(currentPage + siblingsCount + 1) < lastPage && (
                            <Text className="text-gray-300 text-center w-8">...</Text>
                        )}
                        <PaginationItem onPageChange={onPageChange} number={lastPage} />
                    </>
                )}
            </Stack>
        </Stack>
    )
}