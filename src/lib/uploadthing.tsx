import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "./uploadthingtypes";

export const { useUploadThing, uploadFiles } =
generateReactHelpers<OurFileRouter>({
  url: "https://neutral-deborah-dee-individually.trycloudflare.com/api/v1/uploadthing"
});