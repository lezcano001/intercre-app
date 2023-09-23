import { type ChangeEvent } from "react";
import { StandardInput } from "./ui/StandardInput";

interface SearchParticipantInputProps {
    searchText: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    containerClassname?: HTMLDivElement["className"];
}

export function SearchParticipantInput({ onChange, searchText, containerClassname = "" }: SearchParticipantInputProps) {
    return (
        <StandardInput
            label="Buscar Participante:"
            containerClassName={containerClassname}
            placeholder="Ingrese un Doc. de Identidad"
            onChange={onChange}
            value={searchText}
        />
    )
}