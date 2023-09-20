import { Button, Flex, Grid, GridItem, Heading, IconButton } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link'
import { RiArrowLeftLine } from "react-icons/ri";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { DeleteParticipantModal } from "~/components/DeleteParticipantModal";
import { StandardInputViewer } from "~/components/ui/StandardInputViewer";
import { StandardImageInputViewer } from "~/components/ui/StandardImageInputViewer";
import { DEFAULT_USER_IMAGE_URL } from "~/utils/constants";
import { StandardSwitchInputViewer } from "~/components/ui/StandardSwitchInputViewer";

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
                    <GridItem
                        colSpan={2}
                        className="
                            flex
                            items-center
                            justify-center"
                    >
                        <StandardImageInputViewer
                            alt={`Imagen de perfil de ${participant?.data?.firstname} ${participant?.data?.lastname}`}
                            src={participant?.data?.image ? participant?.data?.image.imageURL : DEFAULT_USER_IMAGE_URL}
                        />
                    </GridItem>
                    <GridItem
                        colSpan={2}
                    >
                        <StandardSwitchInputViewer
                            label="Es estudiante:"
                            isChecked={participant?.data?.participantType === "STUDENT"}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInputViewer
                            label="Documento de Identidad:"
                            value={participant?.data?.CI.toString() ?? ""}
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
                            label="Sexo:"
                            value={participant?.data?.gender.label ?? ""}
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