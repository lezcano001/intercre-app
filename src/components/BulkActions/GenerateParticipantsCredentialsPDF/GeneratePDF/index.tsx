import { BulkParticipantsCredentialsPDF } from '../../../templates/BulkParticipantsCredentialsPDF'
import { type GENDERS, type PARTICIPANTS_TYPES_MAP } from "~/utils/constants";
import { isBrowser, isMobile } from "react-device-detect";
import { MobileVersion } from "./MobileVersion";
import { BrowserVersion } from "./BrowserVersion";

type Participant = {
    CI: string;
    name: string;
    age?: number;
    institution: string;
    gender?: typeof GENDERS[number];
    participantType: keyof typeof PARTICIPANTS_TYPES_MAP;
}

interface GeneratePDFProps {
    participants: Participant[];
    isDisabled?: boolean;
}

export function GeneratePDF({ participants, isDisabled = false }: GeneratePDFProps) {
    return (
        <>
            {isMobile ? (
                <MobileVersion
                    document={
                        <BulkParticipantsCredentialsPDF
                            participants={participants}
                        />
                    }
                    isDisabled={isDisabled}
               />
            ) : null}
            {isBrowser ? (
                <BrowserVersion
                    document={
                        <BulkParticipantsCredentialsPDF
                            participants={participants}
                        />
                    }
                    isDisabled={isDisabled}
                />
            ) : null}
        </>
    )
}