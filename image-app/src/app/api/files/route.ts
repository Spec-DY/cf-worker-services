import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  const bucket = getCloudflareContext().env.IMAGE_APP_UPLOADS;
  const body = await request.formData();

  // get all "files", which is like this:
  // "files": [
  //     File {
  //       name: "cat.jpg",
  //       type: "image/jpeg",
  //       size: 1234567,
  //       lastModified: 1618412345678
  //     },
  //     File {
  //       name: "dog.png",
  //       type: "image/png",
  //       size: 2345678,
  //       lastModified: 1618412345679
  //     }
  //   ]
  const files = body.getAll("files");

  for (let x = 0; x < files.length; x++) {
    // get each image in files
    const f = files[x] as File;

    // generate UUID
    const uuid = crypto.randomUUID();

    // put to R2 bucket
    await bucket.put(uuid, f);
  }

  return new Response("Images uploaded", {
    headers: { "content-type": "application/json" },
  });
}
