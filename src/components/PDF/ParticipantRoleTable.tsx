import { Text, View } from "@react-pdf/renderer";
import { Table } from "../PDF/Table";
import { PDF_FONT_BASE_SIZE } from "~/utils/constants";

interface ParticipantRoleTableProps {
    title: string;
    data: string[][];
    additionalField?: string;
}

export function ParticipantRoleTable ({ title, data, additionalField = "Firma" }: ParticipantRoleTableProps) {
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
                data={data.length > 0 ? data : [[]]}
            />
        </View>
    )
}