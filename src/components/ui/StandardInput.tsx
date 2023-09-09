import { FormControl, FormLabel, Input, type InputProps } from "@chakra-ui/react";
import { twMerge } from 'tailwind-merge'

interface StandardInputProps extends InputProps {
    label?: string;
    containerClassName?: HTMLDivElement["className"];
}

export function StandardInput({ label, containerClassName = "", ...rest }: StandardInputProps) {
    return (
        <FormControl
            className={twMerge(`
                w-full`, containerClassName)}
        >
            {label ? (
                <FormLabel>
                    {label}
                </FormLabel>
            ) : null}
            <Input
                variant="filled"
                className="
                    !bg-gray-200"
                {...rest}
            />
        </FormControl>
    )
}