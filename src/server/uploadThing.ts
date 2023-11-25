// import type { NextApiRequest, NextApiResponse } from "next";
 
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

import { getAuth } from "@clerk/nextjs/server";
 
const f = createUploadthing();
 
// const auth = async () => 
// {
//   // console.log(req, res),
//   // { id: "fakeId" }
//   return await currentUser();
// }; // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" }, text: { maxFileSize: "4MB" }, pdf: { maxFileSize: "4MB" }, blob: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const userId = await getAuth(req);
      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      console.log('USERID: ', userId)

      if (!userId.userId) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: userId.userId };
      
      // return { userId: '1'}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
      console.log("file url", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;