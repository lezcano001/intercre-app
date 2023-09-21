import { useDisclosure } from "@chakra-ui/react";
import { type ReactNode, createContext, useContext } from "react";

type SidebarContextData = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
}

const SidebarContext = createContext<SidebarContextData>({} as SidebarContextData)

interface SidebarContextProviderProps {
    children: ReactNode;
}

export function SidebarContextProvider({ children }: SidebarContextProviderProps) {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    return (
        <SidebarContext.Provider
            value={{
                isOpen,
                onClose,
                onOpen,
                onToggle
            }}
        >
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => useContext(SidebarContext)