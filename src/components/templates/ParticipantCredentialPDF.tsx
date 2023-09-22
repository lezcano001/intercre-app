import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const PARTICIPANTS_TYPES_MAP = {
    "STUDENT": {
        "MALE": 'ESTUDIANTE',
        "FEMALE": 'ESTUDIANTE'
    },
    "TEACHER": {
        "MALE": 'PROFESOR',
        "FEMALE": 'PROFESORA'
    }
}

interface ParticipantCredentialPDF {
    CI: string;
    name: string;
    age?: number;
    institution: string;
    participantType: keyof typeof PARTICIPANTS_TYPES_MAP;
    gender?: "MALE" | "FEMALE";
}

Font.register({
    family: 'Inter',
    fonts: [
        {
            src: 'http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
            fontWeight: 'bold'
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
            fontWeight: 'normal'
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
            fontWeight: 'ultrabold'
        }
    ]
})

Font.register({
    family: 'Open-Sans',
    fonts: [
        {
            src: 'http://fonts.gstatic.com/s/opensans/v36/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf',
            fontWeight: 'normal'
        }
    ]
})

const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    CardContainer: {
        width: '7cm',
        height: '10cm',
        border: '1px solid black',
    },
    HeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: '2.4cm',
        marginTop: '0.5cm',
        gap: '0.5cm',
        marginHorizontal: 'auto'
    },
    Image: {
        width: '2cm',
        height: '2cm',
    },
    Logotype: {
        width: '1.8cm',
        height: '1.8cm'
    },
    BodyContainer: {
        paddingHorizontal: '0.8cm',
        fontSize: '0.4cm',
        fontFamily: 'Inter',
        height: '100%'
    },
    Title: {
        fontSize: '0.55cm',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '0.6cm',
        marginBottom: '0.4cm',
        color: '#FF9100'
    },
    ListContainer: {
        display: 'flex',
        gap: '0.2cm'
    },
    ListItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.36cm',
        gap: '0.1cm',
        fontFamily: 'Open-Sans',
        color: '#3F3F46'
    },
    ListItemTitle: {
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: '0.4cm',
        color: '#000000'
    },
    AgeListItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.36cm',
        gap: '0.1cm',
        marginTop: '0.2cm'
    },
    FooterContainer: {
        fontFamily: 'Inter',
        fontWeight: 'ultrabold',
        fontSize: '0.40cm',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '1.4cm',
        backgroundColor: '#B4140F',
        color: 'white',
    },
  });

export function ParticipantCredentialPDF ({
    CI,
    age,
    institution,
    name,
    participantType,
    gender
}: ParticipantCredentialPDF) {
    return (
        <Document>
            <Page
                style={styles.body}
            >
                <View
                    style={styles.CardContainer}
                >
                    <View
                        style={styles.HeaderContainer}
                    >
                        {/* eslint-disable-next-line */}
                        <Image
                            style={styles.Logotype}
                            src="/crece-logotype.png"
                        />
                        {/* eslint-disable-next-line */}
                        <Image
                            style={styles.Image}
                            src="/logotype-variant-1.png"
                        />
                    </View>
                    <View style={styles.BodyContainer}>
                        <View>
                            <Text
                                style={styles.Title}
                            >
                                Acreditación Oficial
                            </Text>
                        </View>
                        <View
                            style={styles.ListContainer}
                        >
                            <View
                                style={styles.ListItem}
                            >
                                <Text
                                    style={styles.ListItemTitle}
                                >
                                    Nombre
                                </Text>
                                <Text>{name}</Text>
                            </View>
                            <View
                                style={styles.ListItem}
                            >
                                <Text
                                    style={styles.ListItemTitle}
                                >
                                    Nro. Documento
                                </Text>
                                <Text>{CI}</Text>
                            </View>
                            <View
                                style={styles.ListItem}
                            >
                                <Text
                                    style={styles.ListItemTitle}
                                >
                                    Institución
                                </Text>
                                <Text>{institution}</Text>
                            </View>
                            {participantType === 'STUDENT' ? (
                                <View
                                    style={styles.AgeListItem}
                                >
                                    <Text
                                        style={styles.ListItemTitle}
                                    >
                                        Edad
                                    </Text>
                                    <Text>{age}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                    <View
                        style={styles.FooterContainer}
                    >
                        <Text>{gender ? PARTICIPANTS_TYPES_MAP[participantType][gender] : PARTICIPANTS_TYPES_MAP[participantType].MALE}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}