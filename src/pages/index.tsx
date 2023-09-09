import { Heading } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";

export default function Home() {
    return (
        <DashboardLayout>
            <Card>
                <Heading
                    as="h1"
                    className="
                        !text-2xl
                        text-gray-600"
                >
                    Bienvenido al panel de control de atletas y equipos
                </Heading>
            </Card>
        </DashboardLayout>
    )
}