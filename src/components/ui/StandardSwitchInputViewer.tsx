import { Flex, Switch, Text } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

interface StandardSwitchInputViewerProps {
    containerClassName?: HTMLDivElement["className"];
    label: string;
    isChecked: boolean;
}

export function StandardSwitchInputViewer({ containerClassName = "", label, isChecked }: StandardSwitchInputViewerProps) {
    return (
        <Flex
            className={twMerge(`
                w-fit
                mx-auto
                items-center
                gap-4
                py-8`, containerClassName)}
        >
            <Text
                as="span"
                className="
                    w-fit
                    !m-0
                    text-gray-600
                    !font-semibold"
            >
                {label}
            </Text>
            <Switch
                className="
                    w-fit"
                size="lg"
                isReadOnly
                isChecked={isChecked}
            />
        </Flex>
    )
}