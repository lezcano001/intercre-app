import { FormControl, FormErrorMessage, FormLabel, Select, type SelectProps } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

interface StandardSelectInputProps extends SelectProps {
    label?: string;
    className?: HTMLSelectElement["className"];
    options: {
        label: string;
        value: string | number;
    }[];
    isError?: string;
}

export function StandardSelectInput({ className = "", options, label, isError, ...rest }: StandardSelectInputProps) {
    return (
        <FormControl
            className={twMerge(`
                w-full`, className)}
            isInvalid={Boolean(isError)}
        >
            {label ? (
                <FormLabel>
                    {label}
                </FormLabel>
            ) : null}
            <Select
                variant="filled"
                className={twMerge(`
                    !bg-gray-200`, className)}
                {...rest}
            >
                {options.map(option => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </Select>
            {isError ? (
                <FormErrorMessage>
                    {isError}
                </FormErrorMessage>
            ) : null}
        </FormControl>
    )
}