import { Flex, Input, Text } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

interface StandardInputViewerProps {
    label: string;
    value: string;
    containerClassName?: HTMLDivElement["className"]
}

export function StandardInputViewer({ label, value, containerClassName = "" }: StandardInputViewerProps) {
    return (
        <Flex
            className={twMerge(`
                flex-col
                gap-2
                w-full`, containerClassName)}
        >
            <Text>
                {label}
            </Text>
            <Input
                as="span"
                variant="filled"
                className="
                    flex
                    items-center
                    !bg-gray-200
                    text-gray-500"
            >
                {value}
            </Input>
        </Flex>
    )
}