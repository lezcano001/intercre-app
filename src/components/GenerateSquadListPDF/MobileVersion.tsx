import { Button, MenuItem } from "@chakra-ui/react";
import { usePDF } from "@react-pdf/renderer";
import { useEffect, type ReactElement } from "react";

interface MobileVersionProps {
    discipline: string;
    document: ReactElement;
    as?: "Button" | "MenuItem";
    isLoading: boolean;
    category: string;
}

export function MobileVersion({
    discipline,
    document,
    as = "Button",
    isLoading,
    category
}: MobileVersionProps) {
    const [instance, update] = usePDF({
        document
    })

    const disabled = isLoading || instance.loading

    useEffect(() => {
        // eslint-disable-next-line
        update(document)
        // eslint-disable-next-line
    }, [document])

    return (
        <>
            {as === "Button" ? (
                <Button
                    colorScheme="orange"
                    download={"Lista_de_buena_fe-" + discipline + "-" + category + "-" + ".pdf"}
                    as='a'
                    href={instance.url!}
                    disabled={disabled}
                    className={`${disabled ? '!bg-orange-400' : ''}`}
                >
                    Imprimir Lista de Buena Fe {disabled ? "..." : ""}
                </Button>
            ) : (
                <MenuItem
                    as='a'
                    download={"Lista_de_buena_fe-" + discipline + "-" + category + "-" + ".pdf"}
                    href={instance.url!}
                    disabled={instance.loading || isLoading}
                >
                    Imprimir Lista de Buena Fe {disabled ? "..." : ""}
                </MenuItem>
            )}
        </>        
    )
}