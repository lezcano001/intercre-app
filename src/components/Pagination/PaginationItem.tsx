import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
    isActive?: boolean;
    number: number;
    onPageChange: (page: number) => void;
}

export function PaginationItem({ number, onPageChange, isActive = false }: PaginationItemProps) {
    if (isActive) {
        return (
            <Button
                size="md"
                colorScheme="orange"
                className="
                    w-4
                    text-xs
                    cursor-default"
                disabled
            >
                {number}
            </Button>
        )
    }

    return (
        <Button
            size="md"
            className="
                text-sm
                w-4"
            onClick={() => onPageChange(number)}
        >
            {number}
        </Button>
    )
}