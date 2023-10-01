import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react"
import { useState } from "react";
import { api } from "~/utils/api";

interface SquadParticipantsListItemProps {
    CI: string;
    name: string;
    disciplineId: string;
    roleId: string;
}

export function SquadParticipantsListItem({
    CI,
    name,
    disciplineId,
    roleId
}: SquadParticipantsListItemProps) {
    const [isLoading, setIsLoading] = useState(false)
    const trpcUtils = api.useContext()
    const toast = useToast()

    const unsuscribeFromSquad = api.squads.unsuscribeFromSquad.useMutation({
        onSuccess: async () => {
            await trpcUtils.squads.invalidate()

            toast({
                title: 'Participante eliminado con éxito',
                position: 'bottom-right',
                isClosable: true,
                status: 'success'
            })
        }
    })

    async function handleUnsuscribeFromSquad({
        participantCI
    }: {
        participantCI: string
    }) {
        setIsLoading(true)

        await unsuscribeFromSquad.mutateAsync({
            disciplineId,
            participantCI,
            roleId
        })

        setIsLoading(false)
    }

    return (
        <Flex
            key={CI}
            className="
                p-6
                w-full
                justify-between
                border-[1px]
                gap-8
                border-slate-200
                rounded-lg
                items-center
                flex-wrap"
        >
            <Box
                className="
                    text-gray-600
                    w-full
                    max-w-md"
            >
                <Box
                    className="
                        w-full"
                >
                    <Heading
                        as="h3"
                        className="
                            mb-4
                            !text-lg"
                    >
                        {name}
                    </Heading>
                </Box>
                <Text>
                    <Text className="text-slate-600" as="strong">C.I.:</Text> {CI}
                </Text>
            </Box>
            <Flex
                className="
                    gap-3
                    flex-col
                    sm:flex-row
                    sm:w-fit
                    sm:flex-wrap
                    w-full"
            >
                <Button
                    isLoading={isLoading}
                    colorScheme="red"
                    onClick={() => {
                        void handleUnsuscribeFromSquad({
                            participantCI: CI
                        })
                    }}
                >
                    Eliminar
                </Button>
            </Flex>
        </Flex>
    )
}