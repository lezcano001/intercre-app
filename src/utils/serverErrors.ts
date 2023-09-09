import { TRPCError } from "@trpc/server";

export function CIUniqueConstraintViolationError() {
    return new TRPCError({
        code: 'BAD_REQUEST',
        message: 'El número de documento ya fue registrado'
    })
}

export function InternalServerError() {
    return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "Error del servidor. Intentelo de nuevo más tarde."
    })
}