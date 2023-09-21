import { Button, Flex, Heading } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link';
import { TeachersTable } from "~/components/TeachersTable";

export default function Teachers() {
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
                        Listado de Profesores
                    </Heading>
                </Flex>
                <TeachersTable />
                {/* Pagination */}
            </Card>
        </DashboardLayout>
    )
}