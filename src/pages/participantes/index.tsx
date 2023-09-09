import { Button, Flex, Heading } from "@chakra-ui/react";
import { ParticipantsTable } from "~/components/ParticipantsTable";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link'

export default function Participants() {
    return (
        <DashboardLayout>
            <Card
                className="flex-col"
            >
                <Flex
                    className="
                        flex
                        items-center
                        justify-between
                        w-full
                        mb-12"
                >
                    <Heading
                        as="h1"
                        className="
                            !text-2xl
                            text-gray-600"
                    >
                        Listado de participantes
                    </Heading>
                    <Flex>
                        {/* Add the searchBar */}
                        <Button
                            as={NextLink}
                            href="/participantes/crear"
                            colorScheme="green"
                        >
                            Agregar Participante
                        </Button>
                    </Flex>
                </Flex>
                <ParticipantsTable />
                {/* Pagination */}
            </Card>
        </DashboardLayout>
    )
}