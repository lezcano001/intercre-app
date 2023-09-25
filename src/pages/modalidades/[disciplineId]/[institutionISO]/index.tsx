import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { TRPCError } from "@trpc/server";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import { RiArrowLeftLine, RiEditLine } from "react-icons/ri";
import { SquadParticipantsList } from "~/components/SquadParticipantsList";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import { api } from "~/utils/api";
import NextLink from 'next/link'
import { GENDERS_MAP } from "~/utils/constants";

interface SquadListQuery extends ParsedUrlQuery {
    disciplineId: string;
    institutionISO: string;
}

// Add the suscription button
// Add the print button
// Add the loading feedback

export default function SquadList() {
    const router = useRouter()
    
    const { disciplineId, institutionISO } = router.query as SquadListQuery

    // Manage the error if the institutionISO is not a number
    const squadData = api.squads.getSquad.useQuery({
        disciplineId,
        institutionISO: parseInt(institutionISO)
    })

    const disciplineData = api.disciplines.getDiscipline.useQuery(disciplineId)

    if (squadData?.data instanceof TRPCError) {
        return (
            <Flex>
                {squadData.data.message}
            </Flex>
        )
    }

    return (
        <DashboardLayout>
            <Flex
                className="
                    flex-col
                    w-full
                    sm:gap-8"
            >
                <Flex
                    className="
                        p-8
                        sm:p-0
                        gap-6
                        w-full
                        items-center
                        flex-wrap"
                >
                    <IconButton
                        colorScheme="yellow"
                        as={NextLink}
                        href="/modalidades"
                        aria-label="Volver"
                        icon={
                            <RiArrowLeftLine
                                className="
                                    w-6
                                    h-6"
                            />
                        }
                    />
                    <Heading
                        as="h1"
                        className="
                            text-gray-600
                            !text-xl
                            sm:!text-2xl"
                    >
                        {disciplineData?.data?.name} { disciplineData?.data?.genreCategory ? GENDERS_MAP[disciplineData?.data?.genreCategory as keyof typeof GENDERS_MAP] : ""} - Lista de Buena Fe
                    </Heading>
                </Flex>
                {squadData?.data?.roles ? squadData.data.roles.map((role) => {
                    return (
                        <Card
                            key={role.title}
                            className="
                                flex-col"
                        >
                            <Flex
                                className="
                                    gap-4
                                    text-gray-500
                                    mb-3"
                            >
                                <RiEditLine
                                    className="
                                        w-6
                                        h-6"
                                />
                                <Heading
                                    className="
                                        !text-xl"
                                >
                                    {role.title}
                                </Heading>
                            </Flex>
                            <Text
                                className="
                                    text-slate-500
                                    text-sm
                                    font-semibold
                                    mb-6"
                            >
                                {role.participants.length} de {role.participantsLimit} cupos inscriptos
                            </Text>
                            <hr
                                className="
                                    mb-3
                                    text-slate-300"
                            />
                            <SquadParticipantsList
                                allowedParticipantType={role.allowedParticipantType}
                                participants={role.participants}
                                disciplineId={disciplineId}
                                institutionISO={parseInt(institutionISO)}
                                roleId={role.roleId}
                                participantsLimit={role.participantsLimit}
                                aceptedGenderCategory={disciplineData?.data?.genreCategory}
                                restrictGenders={role.restrictGenres}
                            />
                        </Card>
                    )
                }) : (
                    <Flex>
                        Cargando...
                    </Flex>
                )}
            </Flex>
        </DashboardLayout>
    )
}