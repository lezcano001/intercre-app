import { Flex, FormControl, FormLabel, Switch, type SwitchProps } from "@chakra-ui/react"
import { twMerge } from "tailwind-merge"

interface StandardSwitchInputProps extends SwitchProps {
    containerClassName?: HTMLDivElement["className"];
    label: string;
}

export function StandardSwitchInput({ containerClassName = "", id, label,...rest }: StandardSwitchInputProps) {
    return (
        <FormControl>
            <Flex
                className={
                    twMerge(`
                    w-fit
                    mx-auto
                    items-center
                    gap-4
                    py-8`, containerClassName)
                }
            >
                <FormLabel
                    className="
                        w-fit
                        !m-0
                        text-gray-600
                        !font-semibold"
                    htmlFor={id}
                >
                    {label}
                </FormLabel>
                <Switch
                    className="
                        w-fit"
                    size="lg"
                    id={id}
                    {...rest}
                />
            </Flex>
        </FormControl>
    )
}