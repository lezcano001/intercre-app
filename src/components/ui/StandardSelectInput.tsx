import { FormControl, FormErrorMessage, FormLabel, Select, type SelectProps } from "@chakra-ui/react";
import { type ForwardRefRenderFunction, forwardRef } from "react";
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

const StandardSelectInputBase: ForwardRefRenderFunction<HTMLSelectElement, StandardSelectInputProps> = ({ className = "", options, label, isError, isRequired, ...rest }, ref) => {
    return (
        <FormControl
            className={twMerge(`
                w-full`, className)}
            isInvalid={Boolean(isError)}
            isRequired={isRequired}
        >
            {label ? (
                <FormLabel>
                    {label}
                </FormLabel>
            ) : null}
            <Select
                ref={ref}
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

export const StandardSelectInput = forwardRef(StandardSelectInputBase)