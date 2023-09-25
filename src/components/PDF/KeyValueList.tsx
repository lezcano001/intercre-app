import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PDF_FONT_BASE_SIZE } from "~/utils/constants";

interface KeyValueListProps {
    data: {
        key: string;
        value: string;
    }[];
}

const KeyValueStyles = StyleSheet.create({
    listContainer: {
        display: 'flex',
        gap: '0.2cm',
        fontWeight: 'normal'
    },
    listItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: PDF_FONT_BASE_SIZE,
    },
    listKey: {
        fontWeight: 'bold',
    }
})

export function KeyValueList({ data }: KeyValueListProps) {
    return (
        <View
            style={KeyValueStyles.listContainer}
        >
            {data.map(({ key, value }) => (
                <View
                    key={key}
                    style={KeyValueStyles.listItemContainer}
                >
                    <Text
                        style={KeyValueStyles.listKey}
                    >
                        {key}
                    </Text>
                    <Text>
                        {value}
                    </Text>
                </View>
            ))}
        </View>
    )
}