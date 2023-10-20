import { generateReactHelpers } from "@uploadthing/react/hooks"

import type { OurFileRouter } from "~/server/uploadThing"

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();