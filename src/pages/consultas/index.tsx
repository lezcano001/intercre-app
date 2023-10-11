import { Heading } from "@chakra-ui/react";
import { QueriesOnlyDashboardLayout } from "~/components/layouts/QueriesOnlyDashboardLayout";
import { Card } from "~/components/ui/Card";

export default function PublicDataQuery() {
    return (
        <QueriesOnlyDashboardLayout>
            <Card>
                <Heading
                    as="h1"
                    className="
                        !text-2xl
                        text-gray-600"
                >
                    Bienvenido a la plataforma de consulta de datos relacionas al InterCRE 2023
                </Heading>
            </Card>
        </QueriesOnlyDashboardLayout>
    )
}