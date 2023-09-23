import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { SuscribeParticipantToSquadButton } from "./SuscribeParticipantToSquadButton";
import { type GENDERS_CATEGORIES } from "~/utils/constants";
import { api } from "~/utils/api";
import { useState } from "react";

interface SquadParticipantsListProps {
    participants: {
        CI: string;
        name: string;
    }[]
    disciplineId: string;
    institutionISO: number;
    roleId: string;
    participantsLimit: number;
    aceptedGenderCategory?: typeof GENDERS_CATEGORIES[number];
    restrictGenders: boolean;
    allowedParticipantType: "STUDENT" | "TEACHER";
}

export function SquadParticipantsList({
    participants,
    disciplineId,
    institutionISO,
    roleId,
    participantsLimit,
    aceptedGenderCategory,
    restrictGenders,
    allowedParticipantType
}: SquadParticipantsListProps) {
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
    const [isLoading, setIsLoading] = useState(false)


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
            className="
                gap-4
                w-full
                flex-col"
        >
            {participants.map((participant) => (
                <Flex
                    key={participant.CI}
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
                                {participant.name}
                            </Heading>
                        </Box>
                        <Text>
                            <Text className="text-slate-600" as="strong">C.I.:</Text> 6.656.045
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
                        <Button>
                            Acreditación - PDF
                        </Button>
                        <Button
                            isLoading={isLoading}
                            colorScheme="red"
                            onClick={() => {
                                void handleUnsuscribeFromSquad({
                                    participantCI: participant.CI
                                })
                            }}
                        >
                            Eliminar
                        </Button>
                    </Flex>
                </Flex>
            ))}
            <Flex
                className="
                    flex-col
                    items-center
                    mt-8
                    rounded-lg
                    gap-5"
            >
                {participants.length === 0 ? (
                    <Text
                        className="
                            text-center
                            text-gray-500"
                    >
                        No hay participantes registrados
                    </Text>
                ) : null}
                {participants.length < participantsLimit ? (
                    <SuscribeParticipantToSquadButton
                        triggerClassname="w-full"
                        disciplineId={disciplineId}
                        allowedParticipantType={allowedParticipantType}
                        institutionISO={institutionISO}
                        roleId={roleId}
                        aceptedGenderCategory={aceptedGenderCategory}
                        restrictGenders={restrictGenders}
                    />
                ) : null}
            </Flex>
        </Flex>
    )
}