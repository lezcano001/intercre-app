import { type ChangeEvent } from "react";
import { StandardInput } from "./ui/StandardInput";

interface SearchInputComponentProps {
    searchText: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    containerClassname?: HTMLDivElement["className"];
    label: string;
    placeholder: string;
}

export function SearchInputComponent({ onChange, searchText, containerClassname = "", label, placeholder }: SearchInputComponentProps) {
    return (
        <StandardInput
            label={label}
            containerClassName={containerClassname}
            placeholder={placeholder}
            onChange={onChange}
            value={searchText}
        />
    )
}