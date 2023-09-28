import { z } from "zod"

const emptyStringToUndefined = z.literal('').transform(() => undefined)

const capitalizeText = (text: string) => text.split(" ").map(word => word[0]!.toUpperCase() + word.substring(1).toLowerCase()).join(" ")

const calculateAge = (birthDate: Date) => {
    const currentDate = new Date()

    let age = currentDate.getFullYear() - birthDate.getFullYear()

    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
        age -= 1
    }

    return age
}

const formatToDateString = new Intl.DateTimeFormat('es-PY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

export {
    emptyStringToUndefined,
    capitalizeText,
    calculateAge,
    formatToDateString
}