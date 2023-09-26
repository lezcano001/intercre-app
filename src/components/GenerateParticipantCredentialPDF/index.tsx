import { ParticipantCredentialPDF } from "../templates/ParticipantCredentialPDF";
import { isBrowser, isMobile } from "react-device-detect";
import { MobileVersion } from "./MobileVersion";
import { BrowserVersion } from "./BrowserVersion";

const PARTICIPANTS_TYPES_MAP = {
    "STUDENT": 'ESTUDIANTE',
    "TEACHER": 'PROFESOR'
}

interface GenerateParticipantCredentialPDF {
    CI: string;
    name: string;
    age?: number;
    institution: string;
    participantType: keyof typeof PARTICIPANTS_TYPES_MAP;
    gender?: "MALE" | "FEMALE";
    as?: "Button" | "MenuItem"
}

export function GenerateParticipantCredentialPDF({
    CI,
    institution,
    name,
    age,
    participantType,
    gender,
    as = "Button"
}: GenerateParticipantCredentialPDF) {
    return (
        <>
            {isMobile
                ?   <MobileVersion
                        CI={CI}
                        document={<ParticipantCredentialPDF
                            CI={CI}
                            institution={institution}
                            name={name}
                            age={age}
                            participantType={participantType}
                            gender={gender}
                        />}
                        as={as}
                    />
                :  null
            }
            {isBrowser
                ?   <BrowserVersion
                        document={<ParticipantCredentialPDF
                            CI={CI}
                            institution={institution}
                            name={name}
                            age={age}
                            participantType={participantType}
                            gender={gender}
                        />}
                        as={as}
                    />
                : null
            }
        </>
    )
}