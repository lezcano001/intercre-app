import { Flex, Heading, Text } from "@chakra-ui/react";
import { ViewUsersGuide } from "~/components/ViewUsersGuide";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";

export default function HelpPage() {
    return (
        <DashboardLayout>
            <Card
                className="
                    flex-col"
            >
                <Heading
                    as="h1"
                    className="
                        !text-2xl
                        text-gray-600
                        mb-6"
                >
                    Ayuda
                </Heading>
                <Flex
                    className="
                        flex-col
                        gap-4
                        text-gray-600
                        leading-8
                        mb-8"
                >
                    <Text>Realice sus consultas a:</Text>
                    <Text className="font-semibold">Elías Lezcano</Text>
                    <Text>Alumno del 3ero BTI - Centro Regional de Educación de Ciudad del Este</Text>
                    <Text>Desarrollador/Administrador de este aplicativo</Text>
                    <Text><span className="font-semibold">Tel:</span> 0984 247 377</Text>
                </Flex>
                <ViewUsersGuide />
            </Card>
        </DashboardLayout>
    )
}