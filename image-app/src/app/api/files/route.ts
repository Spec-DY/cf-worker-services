import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  const ctx = getCloudflareContext();
  const bucket = ctx.env.IMAGE_APP_UPLOADS;
  const body = await request.formData();
  const files = body.getAll("files");

  // store the uploaded images in an array
  const uploadedImages = [];

  for (let x = 0; x < files.length; x++) {
    const f = files[x] as File;

    const uuid = crypto.randomUUID();

    // to R2
    await bucket.put(uuid, f);

    // set url
    const publicUrl = `https://images.dylanjin.com/${uuid}`;

    uploadedImages.push({
      filename: f.name,
      url: publicUrl,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      images: uploadedImages,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
}
