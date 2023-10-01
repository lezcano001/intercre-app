import { Flex, Text } from "@chakra-ui/react";
import { SuscribeParticipantToSquadButton } from "./SuscribeParticipantToSquadButton";
import { type GENDERS_CATEGORIES } from "~/utils/constants";
import { SquadParticipantsListItem } from "./SquadParticipantsListItem";

interface SquadParticipantsListProps {
    participants: {
        CI: string;
        name: string;
    }[]
    disciplineId: string;
    institutionISO: number;
    roleId: string;
    participantsLimit: number;
    aceptedGenderCategory?: typeof GENDERS_CATEGORIES[number];
    restrictGenders: boolean;
    allowedParticipantType: "STUDENT" | "TEACHER";
}

export function SquadParticipantsList({
    participants,
    disciplineId,
    institutionISO,
    roleId,
    participantsLimit,
    aceptedGenderCategory,
    restrictGenders,
    allowedParticipantType
}: SquadParticipantsListProps) {
    return (
        <Flex
            className="
                gap-4
                w-full
                flex-col"
        >
            {participants.map((participant) => (
                <SquadParticipantsListItem
                    key={participant.CI + roleId}
                    CI={participant.CI}
                    disciplineId={disciplineId}
                    name={participant.name}
                    roleId={roleId}
                />
            ))}
            <Flex
                className="
                    flex-col
                    items-center
                    mt-8
                    rounded-lg
                    gap-8"
            >
                {participants.length === 0 ? (
                    <Text
                        className="
                            text-center
                            text-gray-500"
                    >
                        No hay participantes registrados
                    </Text>
                ) : null}
                {participants.length < participantsLimit ? (
                    <SuscribeParticipantToSquadButton
                        triggerClassname="w-full"
                        disciplineId={disciplineId}
                        allowedParticipantType={allowedParticipantType}
                        institutionISO={institutionISO}
                        roleId={roleId}
                        aceptedGenderCategory={aceptedGenderCategory}
                        restrictGenders={restrictGenders}
                    />
                ) : null}
            </Flex>
        </Flex>
    )
}