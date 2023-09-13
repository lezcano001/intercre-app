import { Button, Flex, Grid, GridItem, Heading, IconButton } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link'
import { RiArrowLeftLine } from "react-icons/ri";
// import Image from "next/image";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { DeleteParticipantModal } from "~/components/DeleteParticipantModal";
import { StandardInputViewer } from "~/components/ui/StandardInputViewer";

export default function ParticipantCI() {
    const { query } = useRouter()

    const participant = api.participants.getParticipant.useQuery(query.participantCI as string ?? "")

    return (
        <DashboardLayout>
            <Card
                className="
                    flex-col"
            >
                <Flex
                    className="
                        items-center
                        w-full
                        mb-12
                        justify-between"
                >
                    <Flex
                        className="
                            gap-9
                            items-center"
                    >
                        <IconButton
                            as={NextLink}
                            href="/participantes"
                            icon={
                                <RiArrowLeftLine
                                    className="
                                        w-6
                                        h-6"
                                />
                            }
                            aria-label="Volver"
                        />
                        <Heading
                            as="h1"
                            className="
                                !text-2xl
                                text-gray-600"
                        >
                            Información del participante
                        </Heading>
                    </Flex>
                    <Flex
                        className="
                            gap-4"
                    >
                        <Button
                            as={NextLink}
                            href={"/participantes/editar/" + participant?.data?.CI}
                        >
                            Editar
                        </Button>
                        <DeleteParticipantModal
                            participantCI={query.participantCI as string ?? ""}
                            onSuccessRedirectTo="/participantes"
                        />
                    </Flex>
                </Flex>
                <Grid
                    className="
                        w-full"
                    templateColumns="repeat(2, 1fr)"
                    gap="9"
                >
                    {/* <Image
                        src={}
                    /> */}
                    <GridItem
                        colSpan={2}
                    >
                        <StandardInputViewer
                            label="Documento de Identidad:"
                            value={participant?.data?.CI.toString() ?? ""}
                            containerClassName="
                                max-w-md"
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInputViewer
                            label="Nombre:"
                            value={participant?.data?.firstname ?? ""}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInputViewer
                            label="Apellidos:"
                            value={participant?.data?.lastname ?? ""}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInputViewer
                            label="Fecha de nacimiento:"
                            value={participant?.data?.birthDate ? new Intl.DateTimeFormat("es-PY", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            }).format(participant?.data?.birthDate) : ""}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInputViewer
                            label="Institución:"
                            value={participant?.data?.institution?.name ?? ""}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInputViewer
                            label="Email:"
                            value={participant?.data?.email ?? ""}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInputViewer
                            label="Teléfono:"
                            value={participant?.data?.telephone ?? ""}
                        />
                    </GridItem>
                </Grid>
            </Card>
        </DashboardLayout>
    )
}