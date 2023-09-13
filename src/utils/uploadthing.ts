import { generateReactHelpers } from '@uploadthing/react/hooks'
import type { OurFileRouter } from '~/server/uploadthing'

export const {
    uploadFiles,
    useUploadThing
} = generateReactHelpers<OurFileRouter>()