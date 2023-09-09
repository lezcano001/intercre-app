import { FormControl, FormLabel, Select, type SelectProps } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

interface StandardSelectInputProps extends SelectProps {
    label?: string;
    className?: HTMLSelectElement["className"];
    options: {
        label: string;
        value: string | number;
    }[];
}

export function StandardSelectInput({ className = "", options, label, ...rest }: StandardSelectInputProps) {
    return (
        <FormControl
            className={twMerge(`
                w-full`, className)}
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
        </FormControl>
    )
}