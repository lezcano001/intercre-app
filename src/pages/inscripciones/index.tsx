import { Flex, Heading } from "@chakra-ui/react";
import { RemaindingDisciplinesList } from "~/components/RemaindingDisciplinesList";
import { SquadsTable } from "~/components/SquadsTable";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";

export default function Inscriptions() {
    return (
        <DashboardLayout>
            <Flex
                className="
                    flex-col
                    gap-9"
            >
                <Card
                    className="
                        flex-col"
                >
                    <Heading
                        className="
                            !text-2xl
                            text-gray-600
                            mb-12"
                    >
                        Listas de Buena Fe
                    </Heading>
                    <SquadsTable />
                </Card>
                <Card
                    className="
                        flex-col"
                >
                    <Heading
                        className="
                            !text-2xl
                            text-gray-600
                            mb-12"
                    >
                        Modalidades Disponibles
                    </Heading>
                    <RemaindingDisciplinesList />
                </Card>
            </Flex>
        </DashboardLayout>
    )
}