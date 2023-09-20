import { Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "~/utils/api";

interface ResultItemProps {
    CI: string;
    name: string;
    institutionISO: number;
    roleId: string;
    disciplineId: string
}

export function ResultItem({ CI, name, disciplineId, institutionISO, roleId }: ResultItemProps) {
    const trpcUtils = api.useContext()

    const [isLoading, setIsLoading] = useState(false)

    const suscribeToSquad = api.squads.suscribeToSquad.useMutation({
        onSuccess: async () => {
            await trpcUtils.participants.invalidate()
            await trpcUtils.squads.invalidate()
        }
    })


    async function handleSuscribeParticipant() {
        setIsLoading(true)
        await suscribeToSquad.mutateAsync({
            participantCI: CI,
            disciplineId,
            institutionISO,
            roleId
        })
        setIsLoading(false)
    }

    return (
        <Flex
            className="
                px-4
                py-3
                border-[1px]
                border-slate-300
                rounded-md
                justify-between
                items-center
                w-full"
        >
            <Flex
                className="
                    flex-col
                    text-gray-600
                    gap-1"
            >
                <Text
                    className="
                        font-semibold"
                >
                    {name}
                </Text>
                <Text>
                    {CI}
                </Text>
            </Flex>
            <Button
                onClick={() => {
                    void handleSuscribeParticipant()
                }}
                colorScheme="green"
                isLoading={isLoading}
            >
                Agregar
            </Button>
        </Flex>
    )
}