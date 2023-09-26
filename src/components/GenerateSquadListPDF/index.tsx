import { Text} from "@chakra-ui/react"
import { SquadListInscriptionPDF } from "../templates/SquadListInscriptionPDF";
import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { ROLES_MAP } from "~/utils/constants";
import { isBrowser, isMobile } from "react-device-detect";
import { MobileVersion } from "./MobileVersion";
import { BrowserVersion } from "./BrowserVersion";

interface GenerateSquadListPDFProps {
    disciplineId: string;
    institutionISO: number;
    institutionName: string;
    as?: "Button" | "MenuItem";
    category: string;
}

export function GenerateSquadListPDF({
    disciplineId,
    institutionISO,
    as = "Button",
    institutionName,
    category
}: GenerateSquadListPDFProps) {
    const squad = api.squads.getSquad.useQuery({
        disciplineId,
        institutionISO
    })


    if (squad.data instanceof TRPCError) {
        // Poner aquí un toast
        return <Text>Error en el servidor</Text>
    }

    return (
        <>
            {isMobile ? (
                <MobileVersion
                    category={category}
                    as={as}
                    discipline={institutionName}
                    document={
                        <>
                            {!squad.isLoading ? 
                            <SquadListInscriptionPDF
                                institution={"Centro Regional de Educación " + squad.data!.institution?.name}
                                department={squad.data!.institution!.department}
                                city={squad.data!.institution!.city}
                                roles={squad.data!.roles.map(role => {
                                    return {
                                        students: role.allowedParticipantType === "STUDENT",
                                        participants: role.participants.map(participant => {
                                            return {
                                                CI: participant.CI,
                                                firstname: participant.firstname,
                                                lastname: participant.lastname,
                                                birthDate: `${participant.birthDate.getDate()}/${participant.birthDate.getMonth()}/${participant.birthDate.getFullYear()}`,
                                                telephone: participant.telephone ?? ""
                                            }
                                        }),
                                        roleName: ROLES_MAP[role.role as keyof typeof ROLES_MAP]
                                    }
                                })}
                                discipline={squad.data!.discipline.name}
                                category={squad.data!.discipline.genreCategory}
                            /> : null}
                        </>
                    }
                    isLoading={squad.isLoading}
                />
            ) : null}
            
            {isBrowser ? (
                <BrowserVersion
                    document={
                        <>
                            {!squad.isLoading ? 
                            <SquadListInscriptionPDF
                                institution={"Centro Regional de Educación " + squad.data!.institution?.name}
                                department={squad.data!.institution!.department}
                                city={squad.data!.institution!.city}
                                roles={squad.data!.roles.map(role => {
                                    return {
                                        students: role.allowedParticipantType === "STUDENT",
                                        participants: role.participants.map(participant => {
                                            return {
                                                CI: participant.CI,
                                                firstname: participant.firstname,
                                                lastname: participant.lastname,
                                                birthDate: `${participant.birthDate.getDate()}/${participant.birthDate.getMonth()}/${participant.birthDate.getFullYear()}`,
                                                telephone: participant.telephone ?? ""
                                            }
                                        }),
                                        roleName: ROLES_MAP[role.role as keyof typeof ROLES_MAP]
                                    }
                                })}
                                discipline={squad.data!.discipline.name}
                                category={squad.data!.discipline.genreCategory}
                            /> : null}
                        </>
                    }
                    as={as}
                    isLoading={squad.isLoading}
                />
            ) : null}
        </>
    )
}