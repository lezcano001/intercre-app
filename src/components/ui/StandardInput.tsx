import { FormControl, FormErrorMessage, FormLabel, Input, type InputProps } from "@chakra-ui/react";
import { type ForwardRefRenderFunction, forwardRef } from "react";
import { twMerge } from 'tailwind-merge'

interface StandardInputProps extends InputProps {
    label?: string;
    containerClassName?: HTMLDivElement["className"];
    isError?: string;
    labelClassName?: HTMLLabelElement["className"];
    className?: HTMLInputElement["className"]
}

const BaseStandardInput: ForwardRefRenderFunction<HTMLInputElement, StandardInputProps> = ({ label, containerClassName = "", isError, isRequired, labelClassName = "", className = "", ...rest }, ref) => {
    return (
        <FormControl
            className={twMerge(`!w-full`, containerClassName)}
            isInvalid={Boolean(isError)}
            isRequired={isRequired}
        >
            {label ? (
                <FormLabel
                    className={labelClassName}
                >
                    {label}
                </FormLabel>
            ) : null}
            <Input
                ref={ref}
                variant="filled"
                className={twMerge(`
                    !bg-gray-200`, className)}
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