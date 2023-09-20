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

export function ParticipantNotFound() {
    return new TRPCError({
        code: 'NOT_FOUND',
        message: 'Participante no encontrado'
    })
}

export function ParticipationNotFound() {
    return new TRPCError({
        code: 'NOT_FOUND',
        message: 'La inscripción no ha sido encontrada'
    })
}

export function UnauthorizedError() {
    return new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No tienes los suficientes permisos para realizar esta acción'
    })
}