import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

interface RemainDisciplineCardProps {
    name: string;
    genderCategory: string;
    onClick: () => Promise<void>;
}

export function RemainDisciplineCard({ name, genderCategory, onClick }: RemainDisciplineCardProps) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubscribeButton() {
        setIsLoading(true)
        await onClick()
        setIsLoading(false)
    }

    return (
        <Flex
            className="
                w-full
                h-full
                flex-col
                items-center
                p-8
                bg-gray-100
                rounded-lg
                gap-6"
        >
            <h3
                className="
                    text-gray-600
                    font-semibold
                    text-xl
                    text-center"
            >
                {name + " " + genderCategory}
            </h3>
            <Button
                colorScheme="green"
                isLoading={isLoading}
                onClick={() => {
                    void handleSubscribeButton()
                }}
            >
                Participar
            </Button>
        </Flex>
    )
}