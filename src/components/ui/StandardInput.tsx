import { FormControl, FormErrorMessage, FormLabel, Input, type InputProps } from "@chakra-ui/react";
import { type ForwardRefRenderFunction, forwardRef } from "react";
import { twMerge } from 'tailwind-merge'

interface StandardInputProps extends InputProps {
    label?: string;
    containerClassName?: HTMLDivElement["className"];
    isError?: string;
}

const BaseStandardInput: ForwardRefRenderFunction<HTMLInputElement, StandardInputProps> = ({ label, containerClassName = "", isError, ...rest }, ref) => {
    return (
        <FormControl
            className={twMerge(`
                w-full`, containerClassName)}
            isInvalid={Boolean(isError)}
        >
            {label ? (
                <FormLabel>
                    {label}
                </FormLabel>
            ) : null}
            <Input
                ref={ref}
                variant="filled"
                className="
                !bg-gray-200"
                {...rest}
            />
            {isError ? (
                <FormErrorMessage>
                    {isError}
                </FormErrorMessage>
            ) : null}
        </FormControl>
    )
}

export const StandardInput = forwardRef(BaseStandardInput)