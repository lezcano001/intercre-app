import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { TRPCError } from "@trpc/server";
import { api } from "~/utils/api";
import { RemainDisciplineCard } from "./RemainDisciplineCard";
import { useSession } from "next-auth/react";

export function RemaindingDisciplinesList() {
    const { data } = useSession()

    const remaindingDisciplinesList = api.disciplines.getUnsuscribedDisciplines.useQuery()

    const trpcUtils = api.useContext()

    const suscribeToDiscipline = api.disciplines.suscribeToDiscipline.useMutation({
        onSuccess: async () => {
            await trpcUtils.participations.invalidate()
            await trpcUtils.disciplines.invalidate()
        }
    })

    if (remaindingDisciplinesList?.data instanceof TRPCError) {
        return (
            <Flex>
                {remaindingDisciplinesList.data.message}
            </Flex>
        )
    }

    // if (!remaindingDisciplinesList?.data) {
    //     return <Flex></Flex>
    // }

    if (remaindingDisciplinesList?.data && remaindingDisciplinesList.data.length === 0)  {
        return (
            <Flex
                className="
                    w-full
                    justify-center
                    py-12
                    text-gray-600
                    bg-gray-100
                    rounded-lg"
            >
                No hay modalidades disponibles
            </Flex>
        )
    }

    return (
        <Grid
            className="
                w-full
                grid-cols-[repeat(auto-fill,minmax(17rem,1fr))]
                gap-8"
        >
            {remaindingDisciplinesList?.data ? remaindingDisciplinesList.data.map(remaindingDiscipline => (
                <GridItem
                    className="
                        w-full
                        min-h-[10rem]"
                    key={remaindingDiscipline.disciplineId}
                >
                    <RemainDisciplineCard
                        genderCategory={remaindingDiscipline.genreCategoryLabel}
                        name={remaindingDiscipline.name}
                        onClick={async () => {
                            void await suscribeToDiscipline.mutateAsync({
                                disciplineId: remaindingDiscipline.disciplineId,
                                participantCI: data!.user.participantCI
                            })
                        }}
                    />
                </GridItem>
            )) : null}
        </Grid>
    )
}