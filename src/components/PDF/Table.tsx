import { Text, View } from "@react-pdf/renderer";
import { PDF_FONT_BASE_SIZE } from "~/utils/constants";

interface TableProps {
    headers: {
        name: string;
        width: string;
    }[];
    rowHeight?: string;
    data: string[][];
}

export function Table({ headers, data, rowHeight = '0.6cm' }: TableProps) {
    return (
        <View
            style={{
                width: '100%',
                fontSize: PDF_FONT_BASE_SIZE
            }}
        >
            {/* Header */}
            <View
                style={{
                    border: '0.5px solid black',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    height: rowHeight
                }}
                fixed
            >
                {headers.map((col, idx) => (
                    <View
                        key={col.name}
                        style={{
                            height: '100%',
                            paddingHorizontal: '0.2cm',
                            borderRight: idx === headers.length - 1 ? '' : '0.5px solid black',
                            width: col.width,
                            fontWeight: 'semibold',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text>{col.name}</Text>
                    </View>
                ))}
            </View>
            {/* Body */}
            <View>
                {data ? data.map((_, i) => (
                    // Row
                    <View
                        key={i}
                        style={{
                            borderLeft: '0.5px solid black',
                            borderRight: '0.5px solid black',
                            borderBottom: '0.5px solid black',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            height: rowHeight
                        }}
                        wrap={false}
                    >
                        {headers.map((col, j) => (
                            <View
                                key={j}
                                style={{
                                    paddingHorizontal: '0.2cm',
                                    borderRight: j === headers.length - 1 ? '' : '0.5px solid black',
                                    width: col.width,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    height: '100%',
                                }}
                            >
                                <Text>{data[i]![j]}</Text>
                            </View>
                        ))}
                    </View>                        
                )) : null}
            </View>
        </View>
    )
}