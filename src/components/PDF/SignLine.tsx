import { Text, View } from "@react-pdf/renderer";

interface SignLineProps {
    role: string;
}

export function SignLine({ role }: SignLineProps) {
    return (
        <View
            style={{
                width: '100%',
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <View
                style={{
                    width: '30%',
                    height: '0.6cm',
                    borderTop: '0.5px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text>{role}</Text>
            </View>
            <View
                style={{
                    width: '30%',
                    height: '0.6cm',
                    borderTop: '0.5px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text>Firma</Text>
            </View>
            <View
                style={{
                    width: '30%',
                    height: '0.6cm',
                    borderTop: '0.5px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text>Sello</Text>
            </View>
        </View>
    )
}