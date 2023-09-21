import { Button, Flex, Heading } from "@chakra-ui/react";
import { StudentsTable } from "~/components/StudentsTable";
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
                        Listado de Alumnos
                    </Heading>
                    <Flex>
                        {/* Add the searchBar */}
                        <Button
                            as={NextLink}
                            href="/alumnos/crear"
                            colorScheme="green"
                        >
                            Agregar Alumno
                        </Button>
                    </Flex>
                </Flex>
                <StudentsTable />
                {/* Pagination */}
            </Card>
        </DashboardLayout>
    )
}