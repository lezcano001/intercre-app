import { type ChangeEvent } from "react";
import { StandardInput } from "./ui/StandardInput";

interface SearchParticipantInputProps {
    searchText: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function SearchParticipantInput({ onChange, searchText }: SearchParticipantInputProps) {
    return (
        <StandardInput
            containerClassName="
                flex
                flex-row
                items-center
                gap-3
                max-w-md
                w-full"
            placeholder="Buscar por Doc. de Identidad"
            onChange={onChange}
            value={searchText}
        />
    )
}