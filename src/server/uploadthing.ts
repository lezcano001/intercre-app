import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy'

import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { type NextApiRequest, type NextApiResponse } from 'next'

const f = createUploadthing()

const auth = async (req: NextApiRequest, res: NextApiResponse): Promise<{
    id: string
} | null> => {
    const session = await getServerSession(req, res, authOptions)

    return session ? session?.user : null
}

// FileRouter for our app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRotues as we like, each with a unique routeSlug
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    // Set the permissions and file types for this FileRoute
    }).middleware(async ({req, res}) => {
        // This code runs on our server before upload
        // const user = await auth(req, res)
        const user = await auth(req, res)
        
        // If we throw, the user will not be able to upload
        if (!user) throw new Error("Unauthorized")

        // Whatever is returned here is accesible in onUploadComplete as `metadada`
        return {
            userId: user.id
        }
    })
    .onUploadComplete(({ file, metadata }) => {
        // This code RUNS ON OUR SERVER after upload
        console.log("Upload complete for userId: ", metadata.userId)
        console.log("file url: ", file.url)
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

