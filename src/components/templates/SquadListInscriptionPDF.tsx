import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";
import { KeyValueList } from "../PDF/KeyValueList";
import { ParticipantRoleTable } from "../PDF/ParticipantRoleTable";
import { PDF_FONT_BASE_SIZE, PDF_LINE_HEIGHT_BASE_SIZE } from "~/utils/constants";
import { KeyValueListVariant2 } from "../PDF/KeyValueListVariant2";
import { SignLine } from "../PDF/SignLine";

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: '/assets/Roboto-Bold.ttf',
            fontWeight: 'bold'
        },
        {
            src: '/assets/Roboto-Regular.ttf',
            fontWeight: 'normal'
        },
        {
            src: '/assets/Roboto-Black.ttf',
            fontWeight: 'ultrabold'
        },
        {
            src: '/assets/Roboto-Medium.ttf',
            fontWeight: 'semibold'
        },
        {
            src: '/assets/Roboto-RegularItalic.ttf',
            fontWeight: 'normal',
            fontStyle: 'italic'
        },
        {
            src: '/assets/Roboto-BoldItalic.ttf',
            fontWeight: 'bold',
            fontStyle: 'italic'
        }
    ]
})

const HORIZONTAL_DOCUMENT_MARGINS = '2.5cm'

interface SquadListInscriptionPDFProps {
    institution: string;
    department: string;
    city: string;
    roles: {
        students: boolean;
        roleName: string;
        participants: {
            CI: string;
            firstname: string;
            lastname: string;
            birthDate: string;
            telephone: string;
        }[];
        participantsLimit: number;
    }[];
    discipline: string;
    category: string;
}

export function SquadListInscriptionPDF({
    institution,
    city,
    department,
    roles,
    discipline,
    category
}: SquadListInscriptionPDFProps) {
    return (
        <Document>
            <Page
                orientation="landscape"
                style={{
                    fontFamily: 'Roboto',
                    paddingTop: '3.8cm',
                    paddingBottom: '3cm'
                }}
                size="A4"
            >
                {/* Header */}
                <View
                    style={{
                        paddingHorizontal: HORIZONTAL_DOCUMENT_MARGINS,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                    }}
                    fixed
                >
                    <View
                        style={{
                            width: '100%',
                            display: 'flex',
                            paddingVertical: '0.5cm',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            borderBottom: '0.5px solid black',
                        }}
                    >
                        {/* eslint-disable-next-line */}
                        <Image
                            style={{
                                height: '2cm'
                            }}
                            src="/crece-logotype.png"
                        />
                        {/* eslint-disable-next-line */}
                        <Image
                            style={{
                                height: '2cm'
                            }}
                            src="/logotype-variant-1.png"
                        />
                    </View>
                </View>
                {/* Body - SquadList*/}
                <View
                    style={{
                        marginHorizontal: HORIZONTAL_DOCUMENT_MARGINS,
                    }}
                >
                    {/* Body Header */}
                    <View>
                        <Text
                            style={{
                                marginBottom: '1cm',
                                fontWeight: 'semibold',
                                textAlign: 'center',
                                fontSize: '0.5cm'
                            }}
                        >
                            Ficha de Inscripción
                        </Text>
                        <View
                            style={{
                                display: 'flex',
                                width: '100%',
                                flexDirection: 'row',
                                marginBottom: '0.8cm'
                            }}
                        >
                            <View
                                style={{
                                    width: '50%',
                                }}
                            >
                                <KeyValueList
                                    data={[
                                        {
                                            key: 'Fecha: ',
                                            value: '_____________________'
                                        },
                                        {
                                            key: 'Deporte: ',
                                            value: discipline
                                        },
                                        {
                                            key: 'Categoría: ',
                                            value: category
                                        },
                                    ]}
                                />
                            </View>
                            <View
                                style={{
                                    width: '50%',
                                }}
                            >
                                <KeyValueList
                                    data={[
                                        {
                                            key: 'Institución: ',
                                            value: institution
                                        },
                                        {
                                            key: 'Departamento: ',
                                            value: department
                                        },
                                        {
                                            key: 'Ciudad: ',
                                            value: city
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                display: 'flex',
                                gap: '0.8cm',
                            }}
                        >
                            {roles.map(role => {
                                const tableData = role.participants.map((participant, idx) => {
                                    if (role.students) {
                                        return [String(idx + 1), participant.CI, participant.lastname, participant.firstname, participant.birthDate]
                                    }

                                    return [String(idx + 1), participant.CI, participant.lastname, participant.firstname]
                                })

                                return (<ParticipantRoleTable
                                    key={role.roleName}
                                    title={role.roleName}
                                    data={tableData}
                                    additionalField={role.students ? "Fecha de Nacimiento" : undefined}
                                    participantsLimit={role.participantsLimit}
                                />)
                            })}
                        </View>
                    </View>
                </View>
                {/* Body - Signs */}
                <View
                    style={{
                        marginHorizontal: HORIZONTAL_DOCUMENT_MARGINS,
                        fontSize: PDF_FONT_BASE_SIZE
                    }}
                    break
                >
                    <Text
                        style={{
                            fontStyle: 'italic',
                            lineHeight: PDF_LINE_HEIGHT_BASE_SIZE,
                            marginBottom: '0.4cm'
                        }}
                    >Para lo que hubiere lugar, dejo expresa constancia que los alumnos y oficiales integrantes de la presente Lista de Buena Fe han aprobado satisfactoriamente
los exámenes médicos pertinente, por lo que son declarados aptos y hábiles para la práctica deportiva.
                    </Text>
                    <View
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            marginBottom: '0.4cm'
                        }}
                    >
                        <KeyValueListVariant2
                            data={[
                                {
                                    key: 'Prof. Médico'
                                },
                                {
                                    key: 'Matrícula Médica'
                                },
                                {
                                    key: 'Fecha'
                                },
                            ]}
                        />
                        <View
                            style={{
                                height: '0.6cm',
                                borderTop: '0.5px solid black',
                                width: '13cm',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text>
                                Firma y Sello
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            fontStyle: 'italic',
                            lineHeight: PDF_LINE_HEIGHT_BASE_SIZE
                        }}
                    >
                    Los Directivos de la Institución <Text style={{ fontWeight: 'bold' }}>{institution}</Text>, la Supervisión Pedagógica y Supervisión Administraba de
la Zona __________ certificamos que los atletas representan a esta institución educativa
                    </Text>
                    <View
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.6cm',
                            marginTop: '1.6cm'
                        }}
                    >
                        <SignLine
                            role="Director/a"
                        />
                        <SignLine
                            role="Supervisión Pedagógica"
                        />
                        <SignLine
                            role="Recibido Por"
                        />
                    </View>

                    <Text
                        style={{
                            fontStyle: 'italic',
                            lineHeight: PDF_LINE_HEIGHT_BASE_SIZE,
                            marginTop: '0.6cm'
                        }}
                    >
                    Al presentar esta ficha de inscripción la institución acepta estar de acuerdo y en conocimiento sobre las responsabilidades mencionadas en el Reglamento del
INTERECRE 2023. La autorización de los menores para su participación en el INTERCRE 2023 es de absoluta responsabilidad de la Institución Educativa de Origen.
                    </Text>
                </View>
                {/* Footer */}
                <View
                    fixed
                    style={{
                        height: '3cm',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: PDF_FONT_BASE_SIZE
                    }}
                >
                    <Text render={({ pageNumber, totalPages }) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )}/>
                </View>
            </Page>
        </Document>
    )
}