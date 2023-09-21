import { z } from "zod"

const emptyStringToUndefined = z.literal('').transform(() => undefined)

const capitalizeText = (text: string) => text.split(" ").map(word => word[0]!.toUpperCase() + word.substring(1).toLowerCase()).join(" ")

export {
    emptyStringToUndefined,
    capitalizeText
}