import { Text, View } from "@react-pdf/renderer";
import { Table } from "../PDF/Table";
import { PDF_FONT_BASE_SIZE } from "~/utils/constants";

interface ParticipantRoleTableProps {
    title: string;
    data: string[][];
    additionalField?: string;
    participantsLimit: number;
}

export function ParticipantRoleTable ({ title, data, additionalField = "Firma", participantsLimit }: ParticipantRoleTableProps) {
    return (
        <View
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Text
                style={{
                    fontSize: PDF_FONT_BASE_SIZE,
                    fontWeight: 'semibold',
                    marginBottom: '0.2cm'
                }}
                minPresenceAhead={18}
            >
                {title}
            </Text>
            <Table
                headers={[
                    {
                        name: 'Nro',
                        width: '5%'
                    },
                    {
                        name: 'Nro. de Documento',
                        width: '20%'
                    },
                    {
                        name: 'Apellidos',
                        width: '30%'
                    },
                    {
                        name: 'Nombres',
                        width: '30%'
                    },
                    {
                        name: additionalField,
                        width: '15%'
                    },
                ]}
                data={data.length > 0 ? data : Array.from({length: participantsLimit}).map((_, idx) =>  [String(idx + 1)])}
            />
        </View>
    )
}