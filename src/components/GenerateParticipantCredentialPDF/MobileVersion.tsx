import { Button, MenuItem } from "@chakra-ui/react";
import { usePDF } from "@react-pdf/renderer";
import { type ReactElement } from "react";

interface MobileVersionProps {
    CI: string;
    document: ReactElement;
    as?: "Button" | "MenuItem"
}

export function MobileVersion({ 
    as = "Button",
    document,
    CI
 }: MobileVersionProps) {
    const [instance] = usePDF({
        document
    })

    return (
        <>
            {as === "Button" ? (
                    <Button
                        colorScheme="orange"
                        isLoading={instance.loading}
                        loadingText="Generando Acreditación"
                        download={"acreditacion_" + CI + ".pdf"}
                        as='a'
                        href={instance.url!}
                    >
                        Descargar Acreditación
                    </Button>
                ) : (
                    <MenuItem
                        as='a'
                        download={"Acreditacion_" + CI + ".pdf"}
                        href={instance.url!}
                        disabled={instance.loading}
                    >
                        {instance.loading ? "Generando Acreditación" : "Descargar Acreditación"}
                    </MenuItem>
                )
            }
        </>
    )
}