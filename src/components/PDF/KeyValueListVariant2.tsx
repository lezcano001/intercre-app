import { Text, View } from "@react-pdf/renderer";

interface KeyValueListVariant2Props {
    data: {
        key: string;
        value?: string;
    }[];
    keySize?: string;
    valueGap?: string;
    valueSize?: string;
    itemHeight?: string;
    isEmpty?: boolean;
}

export function KeyValueListVariant2({ data, keySize = '3.2cm', valueGap = '0.3cm', itemHeight = '0.6cm', isEmpty = false }: KeyValueListVariant2Props) {
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {data.map(item => (
                <View
                    key={item.key}
                    style={{
                        height: itemHeight,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            width: keySize,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Text>
                            {item.key}
                        </Text>
                    </View>
                    <Text
                        style={{
                            marginRight: valueGap,
                            height: '0.5cm',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        :
                    </Text>
                    <View
                        style={{
                            borderBottom: '0.5px solid black',
                            width: '5cm',
                            height: itemHeight
                        }}
                    >
                        <Text>
                            {item.value}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    )
}