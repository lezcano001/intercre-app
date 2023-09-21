import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { ResultItem } from "./ResultItem";
import { api } from "~/utils/api";
import { type GENDERS_CATEGORIES } from "~/utils/constants";

interface ResultsListProps {
    searchInput: string;
    roleId: string;
    institutionISO: number;
    disciplineId: string;
    aceptedGenderCategory?: typeof GENDERS_CATEGORIES[number];
    restrictGenders: boolean;
    allowedParticipantsType: "STUDENT" | "TEACHER"; 
    onAddUser: () => void;
}

export function ResultsList({
    searchInput,
    disciplineId,
    institutionISO,
    roleId,
    aceptedGenderCategory,
    restrictGenders,
    allowedParticipantsType,
    onAddUser
}: ResultsListProps) {
    const debouncedSearchInput = useDebounce(searchInput, 400)

    const searchParticipant = api.participants.searchParticipant.useQuery({
        searchText: debouncedSearchInput,
        roleId,
        aceptedGenderCategory,
        restrictGenders,
        allowedParticipantsType,
        searchUsers: true
    })

    const [participants, setParticipants] = useState<{
        name: string;
        CI: string;
    }[]>([])

    useEffect(() => {
        const searchParticipants = () => {
            if (searchParticipant.data) {
                setParticipants(searchParticipant.data.map(searchParticipant => {
                    return {
                        CI: searchParticipant.CI,
                        name: searchParticipant.firstname + " " + searchParticipant.lastname
                    }
                }))
            }
        }

        searchParticipants()
    }, [searchParticipant.data])

    if (searchParticipant.isLoading) {
        return (
            <Flex
                className="
                    py-12
                    w-full
                    justify-center
                    gap-6
                    text-gray-600"
            >
                <Text>Buscando participantes</Text>
                <Spinner />
            </Flex>
        )
    }

    return (
        <Flex
            className="
                w-full
                flex-col
                gap-2"
        >
            <Text
                className="
                    text-gray-600"
            >
                Resultados:
            </Text>
            {participants.length > 0 ? participants.map((result) => (
                <ResultItem
                    key={result.CI}
                    CI={result.CI}
                    name={result.name}
                    disciplineId={disciplineId}
                    institutionISO={institutionISO}
                    roleId={roleId}
                    onAddUser={onAddUser}
                />
            )) : (
                <Flex
                    className="
                        py-8
                        w-full
                        bg-slate-100
                        rounded-md"
                >
                    <Text
                        className="
                            text-center
                            w-full
                            text-gray-600"
                    >
                        No se encontraron similitudes
                    </Text>
                </Flex>
            )}
        </Flex>
    )
}